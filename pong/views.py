
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
from rest_framework import viewsets
from .models import Torneo, Partida
from .serializers import TorneoSerializer, PartidaSerializer
import random
from django.contrib.auth.models import User



def about_view(request):
	contexto_ = {
		'titulo': 'Página de Acerca',
		'descripcion': 'Bienvenido a la página de inicio de nuestro sitio web.'
	}
	return render(request, 'about.html', contexto_)  # Renderiza la plantilla about.html

# Vista para la página de Inicio
def index_view(request):
	contexto_ = {
		'titulo': 'Página de Inicio',
		'descripcion': 'Bienvenido a la página de inicio de nuestro sitio web.'
	}
	return render(request, 'index.html', contexto_)  # Renderiza la plantilla index.html

def base_view(request):
	contexto_ = {
		'titulo': 'Página de Inicio',
		'descripcion': 'Bienvenido a la página de inicio de nuestro sitio web.'
	}
	return render(request, 'base.html', contexto_)  # Renderiza la plantilla index.html

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
    return render(request, 'game.html', contexto_)  # Renderiza la plantilla juego.html

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

# Vista para la página de Torneos
class TorneoViewSet(viewsets.ModelViewSet):
    queryset = Torneo.objects.all()
    serializer_class = TorneoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Guardar el torneo con el creador como el usuario autenticado
        torneo = serializer.save(creado_por=self.request.user)

        # Obtener jugadores desde la base de datos (aquí puedes filtrar según tu lógica)
        jugadores = list(User.objects.all())  # Cambia esto según tu lógica de selección

        # Verificar que haya al menos 8 jugadores disponibles
        if len(jugadores) < 8:
            raise ValidationError("No hay suficientes jugadores para crear un torneo.")

        # Seleccionar 8 jugadores aleatoriamente para el torneo
        jugadores_seleccionados = random.sample(jugadores, 8)

        # Crear las partidas de la primera ronda (1v1 enfrentamientos)
        for i in range(0, 8, 2):
            Partida.objects.create(
                torneo=torneo,
                jugador1=jugadores_seleccionados[i],
                jugador2=jugadores_seleccionados[i+1]
            )

    def retrieve(self, request, *args, **kwargs):
        # Obtener el torneo a través del ID
        instance = self.get_object()
        # Serializar el torneo
        serializer = self.get_serializer(instance)

        # Obtener todas las partidas del torneo
        partidas = Partida.objects.filter(torneo=instance)
        # Serializar las partidas
        partidas_data = PartidaSerializer(partidas, many=True).data

        # Retornar la data del torneo junto con las partidas
        return Response({
            'torneo': serializer.data,
            'partidas': partidas_data
        })
    
class PartidaViewSet(viewsets.ModelViewSet):
    queryset = Partida.objects.all()
    serializer_class = PartidaSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partida = self.get_object()
        ganador = request.data.get('ganador')  # Obtener el ganador desde el cuerpo de la solicitud

        # Actualizar el ganador y marcar la partida como completa
        partida.ganador = User.objects.get(id=ganador)
        partida.save()

        # Avanzar el ganador a la siguiente ronda si es necesario
        # Agregar aquí lógica para gestionar la siguiente fase del torneo
        
        return Response({'status': 'Ganador registrado'})
