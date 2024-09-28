from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('', views.inicio_view, name='inicio'),
    path('acerca/', views.acerca_view, name='acerca'),
    path('juego/', views.juego_view, name='juego'),
	path('api/register/', views.register_view, name='register'), 
	path('register/', views.registro_view, name='registro'), # Ruta para la página de Registro
	path('api/login/', views.login_api_view, name='login_api'), # Ruta para la API de Login
	path('login/', views.login_view, name='login'), # Ruta para la página de Login
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
