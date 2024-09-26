// app.js

window.addEventListener('popstate', cargarContenido);

// Función para cargar contenido sin recargar la página
function cargarContenido(event) {
    const url = window.location.pathname;
    fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })  // Petición para detectar si es una SPA request
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            document.title = doc.querySelector('title').innerText;  // Cambiar el título de la página
            const nuevoContenido = doc.getElementById('contenido').innerHTML;
            document.getElementById('contenido').innerHTML = nuevoContenido;  // Cambiar solo el contenido

            // Lógica adicional para cargar scripts dinámicamente
            if (url === '/juego/') {
                console.log('Cargando juego...');
                cargarScript('/static/game.js');
            } else if (url === '/register/') {
                console.log('Cargando formulario de registro...');
                // Si necesitas cargar algún script adicional para el registro, puedes hacerlo aquí
                cargarScript('/static/register.js');  // Esto es opcional si necesitas lógica específica
            } else if (url === '/login/') {
                console.log('Cargando formulario de login...');
                // Si necesitas cargar algún script adicional para login
                cargarScript('/static/login.js');  // Esto es opcional si tienes lógica específica para login
            }
        })
        .catch(error => console.error('Error al cargar el contenido:', error));
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
