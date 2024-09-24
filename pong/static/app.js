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
        });
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
