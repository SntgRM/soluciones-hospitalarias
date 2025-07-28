from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
import base64
from django.core.files.base import ContentFile

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError("Usuario inactivo")
            else:
                raise serializers.ValidationError("Credenciales inválidas")
        else:
            raise serializers.ValidationError("Debe incluir usuario y contraseña")
        
        return data
    
class UserSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'role', 'date_joined', 'profile_image', 'profile_image_url']

    def get_profile_image_url(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    image = serializers.CharField(write_only=True, required=False)
   
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'role', 'image']

    def validate(self, data):
        if 'username' in data:
            data['username'] = data['username'].lower()
        if 'first_name' in data:
            data['first_name'] = data['first_name'].upper()
        return data

    def create(self, validated_data):
        image_data = validated_data.pop('image', None)
        password = validated_data.pop('password')
        role = validated_data.get('role')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)

        if role == 'administrador':
            user.is_staff = True
            user.is_superuser = True
        else:
            user.is_staff = False
            user.is_superuser = False

        if image_data:
            self._process_image(user, image_data)
        user.save()
        return user
    
    def _process_image(self, user, image_data):
        try:
            if image_data.startswith('data:image'):
                format_part, data_part = image_data.split(';base64,')
                ext = format_part.split('/')[-1]

                image_file = ContentFile(
                    base64.b64decode(data_part),
                    name=f'user_{user.id}.{ext}'
                )
                user.profile_image.save(f'user_{user.id}.{ext}', image_file, save=False)
        except Exception as e:
            print(f"Error procesando imagen: {e}")

class UserUpdateSerializer(serializers.ModelSerializer):
    image = serializers.CharField(write_only=True, required=False)

    def validate(self, data):
        if 'username' in data:
            data['username'] = data['username'].lower()
        if 'first_name' in data:
            data['first_name'] = data['first_name'].upper()
        return data
    
    def update(self, instance, validated_data):
        image_data = validated_data.pop('image', None)
        role = validated_data.get('role', instance.role)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if role == 'administrador':
            instance.is_staff = True
            instance.is_superuser = True
        else:
            instance.is_staff = False
            instance.is_superuser = False

        if image_data:
            self._process_image(instance, image_data)
        
        instance.save()
        return instance

    def _process_image(self, user, image_data):
        try:
            if image_data.startswith('data:image'):
                format_part, data_part = image_data.split(';base64,')
                ext = format_part.split('/')[-1]
                
                image_file = ContentFile(
                    base64.b64decode(data_part), 
                    name=f'user_{user.id}.{ext}'
                )
                user.profile_image.save(f'user_{user.id}.{ext}', image_file, save=False)
        except Exception as e:
            print(f"Error procesando imagen: {e}")
    class Meta:
        model = User
        fields = ['username', 'first_name', 'role', 'image']