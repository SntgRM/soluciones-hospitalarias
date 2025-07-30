from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import User
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserLoginSerializer, UserRegistrationSerializer, UserSerializer, UserUpdateSerializer
from django.contrib.auth.views import PasswordResetView
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings
from .serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from django.contrib.auth.views import PasswordResetConfirmView
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth import get_user_model
from rest_framework.views import APIView

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            frontend_reset_link = f"{settings.FRONTEND_URL}/password-reset-confirm/{uid}/{token}/"
            email_subject = 'Password Reset Request'
            email_body = render_to_string('password_reset_email.html', {
                'user': user,
                'frontend_reset_link': frontend_reset_link,
            })

            send_mail(email_subject, email_body, settings.DEFAULT_FROM_EMAIL, [user.email])

        return Response({'message': 'If an account with that email exists, a password reset link has been sent.'}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        uidb64 = self.kwargs.get('uidb64')
        token = self.kwargs.get('token')

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = get_user_model().objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid token or user ID.'}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        if self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        profile_image_url = None
        if user.profile_image:
            profile_image_url = request.build_absolute_uri(user.profile_image.url)
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'role': user.role,
                'profile_image_url': profile_image_url,
            },
            'token': token.key
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Eliminar el token del usuario actual
        request.user.auth_token.delete()
        return Response({'message': 'Logout exitoso'}, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Error al hacer logout'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    profile_image_url = None
    if user.profile_image:
        profile_image_url = request.build_absolute_uri(user.profile_image.url)
    return Response({
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'first_name': request.user.first_name,
            'role': request.user.role,
            'profile_image_url': profile_image_url
        }
    })