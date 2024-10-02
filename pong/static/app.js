// app.js

window.addEventListener('popstate', cargarContenido);

// Función para cargar contenido sin recargar la página
// app.js

// Función para obtener el token del localStorage
function getToken() {
    return localStorage.getItem('access');  // Cambia 'access' por el nombre de tu token si es diferente
}

// Función para cargar contenido sin recargar la página
function cargarContenido(event) {
    const url = window.location.pathname;
    const headers = {
        'X-Requested-With': 'XMLHttpRequest', // Manteniendo la cabecera AJAX
    };

    // Agregar el token JWT al encabezado si existe
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;  // Añadir el token al encabezado
    }

    fetch(url, { headers: headers })  // Petición para detectar si es una SPA request
        .then(response => {
            if (!response.ok) {
                // Manejar errores de autenticación (401)
                if (response.status === 401) {
                    alert('Token inválido o expirado. Redirigiendo al login.');
                    window.location.href = '/login/';  // Redirigir al login si el token no es válido
                }
                throw new Error('Error en la solicitud');  // Lanzar un error para manejarlo más abajo
            }
            return response.text();  // Retornar el HTML si la respuesta es correcta
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            document.title = doc.querySelector('title').innerText;  // Cambiar el título de la página
            const nuevoContenido = doc.getElementById('contenido').innerHTML;
            document.getElementById('contenido').innerHTML = nuevoContenido;  // Cambiar solo el contenido

            // Cargar game.js si estamos en la página del juego
            if (url === '/juego/') {
                console.log('cargando juego');
                cargarScript('/static/game.js');
            }
            if (url === '/register/') {
                console.log('cargando register');
                cargarScript('/static/register.js');
            }
            if (url === '/login/') {
                console.log('cargando login');
                cargarScript('/static/login.js');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para cargar un script dinámicamente
function cargarScript(src) {
    // Eliminar el script existente si lo hay
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
        existingScript.remove();
    }
    // Añadir el nuevo script
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
}

// Interceptar los clicks en los enlaces para hacerlos funcionar sin recargar la página
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const href = this.getAttribute('href');
        history.pushState(null, '', href);  // Cambiar la URL sin recargar
        cargarContenido();
    });
});


