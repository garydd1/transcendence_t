// login.js
(function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            const loginData = {
                username: username,
                password: password
            };

            // Obtener el token CSRF
            const csrfToken = getCookie('csrftoken'); // Necesitamos esta función para obtener el token
            console.log("CLICK!");
            fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken // Incluir el token CSRF
                },
                body: JSON.stringify(loginData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(JSON.stringify(errData));
                    });
                }
                return response.json(); 
            })
            .then(data => {
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);

                const responseMessage = document.getElementById('login-response-message');
                responseMessage.textContent = 'Inicio de sesión exitoso. Redirigiendo...';

                setTimeout(() => {
                    window.location.href = '/juego/';
                }, 1000);
            })
            .catch(error => {
                console.error('Error al iniciar sesión:', error);
                const responseMessage = document.getElementById('login-response-message');
                responseMessage.textContent = 'Credenciales inválidas. Inténtalo de nuevo.';
            });
        });
    }

    // Función para obtener el token CSRF desde las cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
})();