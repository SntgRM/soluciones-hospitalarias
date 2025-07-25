from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

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
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'role', 'date_joined']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
   
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'role']

    def validate(self, data):
        if 'username' in data:
            data['username'] = data['username'].lower()
        if 'first_name' in data:
            data['first_name'] = data['first_name'].upper()
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserUpdateSerializer(serializers.ModelSerializer):

    def validate(self, data):
        if 'username' in data:
            data['username'] = data['username'].lower()
        if 'first_name' in data:
            data['first_name'] = data['first_name'].upper()
        return data
    class Meta:
        model = User
        fields = ['username', 'first_name', 'role']