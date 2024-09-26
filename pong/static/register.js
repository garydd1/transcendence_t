// register.js

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío por defecto del formulario

        // Capturar datos del formulario
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        // Crear un objeto con los datos
        const data = {
            username: username,
            email: email,
            password: password,
        };

        // Enviar datos al servidor
        fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), // Añadir el token CSRF si es necesario
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta
            const responseMessage = document.getElementById('register-response-message');
            if (data.success) {
                responseMessage.textContent = 'Registro exitoso. Puedes iniciar sesión ahora.';
                // Limpiar el formulario si es necesario
                registerForm.reset();
            } else {
                responseMessage.textContent = 'Error: ' + data.message; // Mensaje de error
            }
        })
        .catch(error => {
            console.error('Error al registrar:', error);
        });
    });
});

// Función para obtener el token CSRF desde las cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Verifica si esta cookie comienza con el nombre dado
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

if (typeof csrftoken === 'undefined') {
    const csrftoken = getCookie('csrftoken');  // Función que obtienes del código anterior
}

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Hacer la solicitud POST al backend
    fetch('/api/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken, // Incluir el token CSRF
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    })
    .then(response => {
		if (!response.ok) {
			return response.json().then(errData => {
				throw new Error(JSON.stringify(errData));  // Capturar el error
			});
		}
		return response.json();
	})
    .then(data => {
        alert(data.message); // Mostrar mensaje de éxito
    })
    .catch(error => {
		console.error('Errordg:', error);
        error.json().then(errData => {
            let errorMessage = 'Errores:\n';
            for (const [key, value] of Object.entries(errData)) {
                errorMessage += `${key}: ${value.join(', ')}\n`;
            }
            alert(errorMessage); // Mostrar mensajes de error
        });
    });
});

