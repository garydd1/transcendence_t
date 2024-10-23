from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Torneo, Partida

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class PartidaSerializer(serializers.ModelSerializer):
    jugador1 = serializers.StringRelatedField(source='jugador1.username')  # Accede al username
    jugador2 = serializers.StringRelatedField(source='jugador2.username')  # Accede al username
    ganador = serializers.StringRelatedField(source='ganador.username', default = None)  # Accede al username

    class Meta:
        model = Partida
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']  

class TorneoSerializer(serializers.ModelSerializer):
    partidas = PartidaSerializer(many=True, read_only=True)
    creado_por = UserSerializer(read_only=True)  # Usar el serializer de usuario aquí

    class Meta:
        model = Torneo
        fields = '__all__'