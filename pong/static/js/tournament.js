// Cargar torneos cuando se navega a la página del torneo
document.addEventListener('DOMContentLoaded', function () {
    cargarTorneos();
});

// Manejar el evento de envío del formulario para crear un torneo
document.getElementById('crear-torneo-form').addEventListener('submit', function (event) {
    event.preventDefault();  // Prevenir la recarga de la página

    const nombreTorneo = document.getElementById('nombre-torneo').value;
    crearTorneo(nombreTorneo);  // Llamar a la función para crear el torneo
});

// Función para cargar los torneos desde el backend
function cargarTorneos() {
    fetch('/api/torneos/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`, // Obtener el token JWT del localStorage
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        mostrarTorneos(data);  // Mostrar los torneos en la UI
    })
    .catch(error => {
        console.error('Error al cargar los torneos:', error);
    });
}

// Función para mostrar los torneos en la UI
function mostrarTorneos(torneos) {
    const contenedorTorneos = document.getElementById('torneos-contenido');  // Correcto id aquí
    contenedorTorneos.innerHTML = '';  // Limpiar el contenido previo

    if (torneos.length === 0) {
        contenedorTorneos.innerHTML = '<p>No hay torneos disponibles.</p>';
        return;
    }

    // Mostrar todos los torneos disponibles
    torneos.forEach(torneo => { 
        const torneoDiv = document.createElement('div');
        torneoDiv.classList.add('torneo');

        // Mostrar el nombre del torneo y el creador
        torneoDiv.innerHTML = `
            <h3>Torneo: ${torneo.nombre}</h3>
            <p>Creador: ${torneo.creado_por.username}</p>
            <button onclick="mostrarArbolTorneo(${torneo.id})">Ver Árbol del Torneo</button>
        `;

        contenedorTorneos.appendChild(torneoDiv);
    });
}

// Función para crear un torneo
function crearTorneo(nombre) {
    fetch('/api/torneos/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`, // Token JWT
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: nombre })  // El nombre del torneo enviado en el cuerpo
    })
    .then(response => {
        if (!response.ok) {
            // Si la respuesta no es OK, devolver el error detallado
            return response.json().then(errorData => {
                throw new Error(`Error: ${response.status} - ${JSON.stringify(errorData)}`);
            });
        }
        return response.json(); // Procesar la respuesta si todo está bien
    })
    .then(data => {
        alert('Torneo creado con éxito');
        cargarTorneos();  // Recargar los torneos después de crear uno nuevo
    })
    .catch(error => {
        // Mostrar detalles del error en la consola
        console.error('Error al crear el torneo:', error.message);
        alert('Error al crear el torneo. Consulta la consola para más detalles.');
    });
}


// Función para mostrar el árbol del torneo
// Función para mostrar el árbol del torneo
function mostrarArbolTorneo(torneoId) {
    fetch(`/api/torneos/${torneoId}/`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`, // Token JWT
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const arbolDiv = document.getElementById('torneo-arbol');
        arbolDiv.innerHTML = '';  // Limpiar el contenido previo

        arbolDiv.innerHTML = `<h4>Árbol del Torneo para: ${data.torneo.nombre}</h4>`;
        let rondas = {};  // Crear un objeto para agrupar partidas por rondas

        data.partidas.forEach(partida => {
            if (!rondas[partida.ronda]) {
                rondas[partida.ronda] = [];  // Inicializar array para esta ronda
            }
            rondas[partida.ronda].push(`
                <div>
                    <p>${partida.jugador1} vs ${partida.jugador2}</p>
                    <p>Ganador: ${partida.ganador ? partida.ganador.username : 'Pendiente'}</p>
                </div>
            `);
        });

        // Mostrar las partidas por rondas
        Object.keys(rondas).forEach(ronda => {
            arbolDiv.innerHTML += `<h5>Ronda ${ronda}</h5>`;
            rondas[ronda].forEach(partidaHtml => {
                arbolDiv.innerHTML += partidaHtml;
            });
        });
    })
    .catch(error => {
        console.error('Error al mostrar el árbol del torneo:', error);
    });
}
