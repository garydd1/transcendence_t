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
    class Meta:
        model = Partida
        fields = '__all__'

class TorneoSerializer(serializers.ModelSerializer):
    partidas = PartidaSerializer(many=True, read_only=True)

    class Meta:
        model = Torneo
        fields = '__all__'