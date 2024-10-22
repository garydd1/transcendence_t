from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter
from .views import TorneoViewSet, PartidaViewSet
from django.views.generic import TemplateView


router = DefaultRouter()
router.register(r'torneos', TorneoViewSet)
router.register(r'partidas', PartidaViewSet)

urlpatterns = [
    path('', views.base_view, name='inicio'),
	path('login2/', auth_views.LoginView.as_view(template_name='login2.html'), name='login2'),
	path('index/', views.index_view, name='index'),
	path('about/', views.about_view, name='about'),
    path('juego/', views.juego_view, name='juego'),
	path('api/register/', views.register_view, name='register'), 
	path('register/', views.registro_view, name='registro'), # Ruta para la página de Registro
	path('api/login/', views.login_api_view, name='login_api'), # Ruta para la API de Login
	# path('login/', views.login_view, name='login'), # Ruta para la página de Login
	path('api/', include(router.urls)),
	path('torneo/', TemplateView.as_view(template_name="torneo.html"), name='torneo'),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
