from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import UserLoginSerializer, UserRegistrationSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name
            },
            'token': token.key
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout(request):
    try:
        # Eliminar el token del usuario actual
        request.user.auth_token.delete()
        return Response({'message': 'Logout exitoso'}, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Error al hacer logout'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def profile(request):
    return Response({
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name
        }
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user(request):
    if not request.user.is_admin:
        return Response({'error': 'No tiene permisos para crear usuarios'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'Usuario creado existosamente'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)