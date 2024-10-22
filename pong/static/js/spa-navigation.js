window.addEventListener('popstate', cargarContenido);

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
        console.log('Token enviado:', token);
        headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(url, { headers: headers })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    alert('Token inválido o expirado. Redirigiendo al login.');
                    // Redirigir al login sin intentar cargar el contenido
                    history.pushState(null, '', '/login2/'); 
                    // Cargar el contenido del login
                    return UrlRedirect('/login2/');
                }
                throw new Error('Error en la solicitud');
            }
            return response.text();
        })
        .then(html => {
            if (html) {
                updateContent(html);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para cargar el contenido de una URL específica
function UrlRedirect(url) {
    return fetch(url)
        .then(response => response.text())
        .then(html => {
            if (html) {
                updateContent(html);
            }
        })
        .catch(error => console.error('Error al cargar contenido desde URL:', error));
}

// Función para actualizar el contenido de la página
function updateContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const nuevoContenido = doc.getElementById('main-content').innerHTML;
    document.getElementById('main-content').innerHTML = nuevoContenido;
    document.title = doc.title;  // Cambiar el título de la página
    const pageType = doc.body.getAttribute('data-page');
    if (pageType) {
        cargarScriptDinamico(pageType);
    }
}

// Resto del código permanece igual...

// Función para cargar scripts dinámicamente según la página
function cargarScriptDinamico(pageType) {
    let scriptPath;

    // Decidir el script basado en el atributo data-page
    switch (pageType) {
        case 'game':
            scriptPath = '/static/js/game.js';
            break;
        case 'register':
            scriptPath = '/static/js/register.js';
            break;
        case 'login':
            scriptPath = '/static/js/login.js';
            break;
        case 'tournament':
            scriptPath = '/static/js/tournament.js';
            break;
        default:
            console.log('No se requiere cargar scripts adicionales para esta página.');
            return; // Salir si no hay script que cargar
    }

    cargarScript(scriptPath);
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



// Interceptar los clics en los enlaces para hacerlos funcionar sin recargar la página
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const href = this.getAttribute('href');
        history.pushState(null, '', href); // Cambiar la URL sin recargar
        cargarContenido();
    });
});
