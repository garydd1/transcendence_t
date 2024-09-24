
from django.shortcuts import render

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
