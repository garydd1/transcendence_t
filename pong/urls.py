from django.urls import path
from . import views

urlpatterns = [
    path('', views.inicio_view, name='inicio'),
    path('acerca/', views.acerca_view, name='acerca'),
    path('juego/', views.juego_view, name='juego'),
	path('api/register/', views.register_view, name='register'), 
	path('register/', views.registro_view, name='registro'),
]
