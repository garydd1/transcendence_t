
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from .jwt_auth import jwt42_required



# Vista para la página de Inicio
def inicio_view(request):
    contexto_ = {
        'titulo': 'Página de Inicio',
        'descripcion': 'Bienvenido a la página de inicio de nuestro sitio web.'
    }
    return render(request, 'inicio.html', contexto_)  # Renderiza la plantilla inicio.html

# Vista para la página "Acerca"
def acerca_view(request):
    contexto_ = {
        'titulo': 'Página de acerca',
        'descripcion': 'Bienvenido a la página de inicio de nuestro sitio web.'
    }
    return render(request, 'acerca.html', contexto_)  # Renderiza la plantilla acerca.html

# Vista para la página del Juego
@jwt42_required
def juego_view(request):
    contexto_ = {
        'titulo': 'Página de Juego',
        'descripcion': 'Bienvenido a la página de inicio de nuestro sitio web.'
    }
    return render(request, 'juego.html', contexto_)  # Renderiza la plantilla juego.html

def login_view(request):
	contexto_ = {
		'titulo': 'Página de Login',
		'descripcion': 'Bienvenido a la página de inicio de nuestro sitio web.'
	}
	return render(request, 'login.html', contexto_)  # Renderiza la plantilla login.html

def registro_view(request):
	contexto_ = {
		'titulo': 'Página de Registro',
		'descripcion': 'Bienvenido a la página de inicio de nuestro sitio web.'
	}
	return render(request, 'register.html', contexto_)  # Renderiza la plantilla registro.html


@api_view(['POST'])
def login_api_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Autenticar al usuario
    user = authenticate(username=username, password=password)
    if user is not None:
        # Si la autenticación es exitosa, generar los tokens JWT
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    else:
        return Response({'error': 'Credenciales inválidas'}, status=400)

@api_view(['POST'])
def register_view(request):
    # Manejar el registro cuando es una petición POST
    print("Entrando en Serializer")
    print("Datos de la petición: ", request.data)
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Usuario registrado correctamente."}, status=status.HTTP_201_CREATED)
    print("Saliendo de Serializer Con Errores: ", serializer.errors) 
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)