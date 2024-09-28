document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
		console.log("data:");
		console.log(data);
        if (response.ok) {
            alert(data.message);  // Mostrar mensaje de éxito
        } else {
            alert(JSON.stringify(data));  // Manejar errores
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function handleErrors(errors) {
    const errorContainer = document.getElementById('register-response-message');
    errorContainer.innerHTML = '';  // Limpiar errores previos

    for (const [field, messages] of Object.entries(errors)) {
        messages.forEach(message => {
            const errorElement = document.createElement('div');
            errorElement.className = 'error';
            errorElement.textContent = `${field}: ${message}`;
            errorContainer.appendChild(errorElement);
        });
    }
}