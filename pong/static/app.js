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

            // Cargar game.js si estamos en la página del juego
            if (url === '/juego/') {
                console.log('cargando juego');
                cargarScript('/static/game.js');
            }
			if (url === '/register/') {
				console.log('cargando register');
				cargarScript('/static/register.js');
			}
        });
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