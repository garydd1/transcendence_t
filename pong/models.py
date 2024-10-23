from django.db import models
from django.contrib.auth.models import User

class Torneo(models.Model):
    nombre = models.CharField(max_length=100)
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

class Partida(models.Model):
    torneo = models.ForeignKey(Torneo, on_delete=models.CASCADE, related_name='partidas')
    jugador1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jugador1')
    jugador2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jugador2')
    ganador = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='ganador', null=True, blank=True)
    fecha_partida = models.DateTimeField(auto_now_add=True)
    ronda = models.IntegerField(default=1)  # Nuevo campo para identificar la ronda

    def __str__(self):
        return f"{self.jugador1} vs {self.jugador2} en {self.torneo.nombre}"
