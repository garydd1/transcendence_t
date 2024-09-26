
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import RegisterSerializer



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
def register_view(request):
    # Manejar el registro cuando es una petición POST
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Usuario registrado correctamente."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)