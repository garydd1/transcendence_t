window.addEventListener('hashchange', actualizarContenido);

// Función principal para cargar el contenido basado en el hash
function cargarContenido(hash) {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = '';  // Limpiar el contenido previo

    if (hash === '#inicio') {
        contenido.innerHTML = `
            <h1>Bienvenido a la página de inicio</h1>
            <p>Esta es una SPA sencilla con solo dos secciones: Inicio y Acerca de.</p>
        `;
    } else if (hash === '#acerca') {
        contenido.innerHTML = `
            <h1>Acerca de esta SPA</h1>
            <p>Esta es una demostración básica de una SPA (Single Page Application).</p>
        `;
    } else if (hash === '#juego') {
        // Aquí se mostrará el canvas del juego
        contenido.innerHTML = `
            <h1>Mini-juego de Pong</h1>
            <canvas id="pong" width="600" height="400" style="border:1px solid #000;"></canvas>
        `;
        iniciarJuego();
    }
}

// Cargar el contenido inicial cuando se carga la página
function actualizarContenido() {
    cargarContenido(window.location.hash || '#inicio');
}
window.onload = actualizarContenido;

// Función para inicializar el juego de Pong
function iniciarJuego() {
    const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Dimensiones del paddle
const paddleWidth = 100;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

// Variables de control de movimiento
let derechaPresionada = false;
let izquierdaPresionada = false;

// Variables de la pelota
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let velocidadIncremento = 1.1; // Incremento de velocidad

// Variable para controlar el estado del juego
let gameOver = false;

// Dibujar el paddle
function dibujarPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Dibujar la pelota
function dibujarPelota() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Detectar colisiones con el paddle y las paredes
function detectarColisiones() {
    // Colisión con las paredes laterales
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    // Colisión con el techo
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    // Colisión con el paddle
    if (y + dy > canvas.height - ballRadius - paddleHeight) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            // Incrementar la velocidad de la pelota
            dy *= velocidadIncremento;
            dx *= velocidadIncremento;
        } else {
            // Mostrar mensaje de Game Over y reiniciar el juego después de un retraso
            gameOver = true;
            ctx.font = "30px Arial";
            ctx.fillStyle = "red";
            ctx.fillText("Game Over", canvas.width / 2 - 75, canvas.height / 2);
            setTimeout(reiniciarJuego, 2000); // 2 segundos de retraso
        }
    }
}

// Actualizar la posición de la pelota
function actualizarPosicionPelota() {
    x += dx;
    y += dy;
}

// Dibujar todo
function dibujar() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarPaddle();
        dibujarPelota();
        detectarColisiones();
        actualizarPosicionPelota();

        // Mover el paddle
        if (derechaPresionada && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (izquierdaPresionada && paddleX > 0) {
            paddleX -= 7;
        }

        requestAnimationFrame(dibujar);
    }
}

// Detectar teclas presionadas
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        derechaPresionada = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        izquierdaPresionada = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        derechaPresionada = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        izquierdaPresionada = false;
    }
}

// Reiniciar el juego
function reiniciarJuego() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width - paddleWidth) / 2;
    gameOver = false;
    dibujar();
}

// Iniciar el juego
dibujar();
}
