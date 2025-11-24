// ===========================
//  CANVAS Y CONFIGURACIÓN
// ===========================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tamaño del laberinto
const MAZE_COLS = 20;
const MAZE_ROWS = 15;
const CELL_SIZE = Math.min(canvas.width / MAZE_COLS, canvas.height / MAZE_ROWS);

// Ajustar canvas al tamaño exacto del laberinto
canvas.width = MAZE_COLS * CELL_SIZE;
canvas.height = MAZE_ROWS * CELL_SIZE;


// ===========================
//  POSICIÓN DEL JUGADOR
// ===========================

let playerGridX = 1;
let playerGridY = 1;

const PLAYER_SIZE = CELL_SIZE * 0.8;
const PLAYER_OFFSET = (CELL_SIZE - PLAYER_SIZE) / 2;


// ===========================
//  IMAGEN DEL PERSONAJE
// ===========================

const playerImage = new Image();
let imageLoaded = false;

playerImage.src = "img/yuji.png";

playerImage.onload = () => {
    imageLoaded = true;
    console.log("Imagen cargada correctamente");
    draw();
};

playerImage.onerror = () => {
    console.log("Error al cargar imagen, usando emoji");
    imageLoaded = false;
};


// ===========================
//  LABERINTO (1 = pared)
// ===========================

const walls = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,0,0,1,1,1,0,1,0,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];


// ===========================
//  META DEL NIVEL
// ===========================

const goalGridX = 18;
const goalGridY = 13;


// ===========================
//  SISTEMA DE SONIDOS
// ===========================

const sounds = {
    paso: new Audio("sounds/paso.mp3"),
    pared: new Audio("sounds/pared.mp3"),
    meta: new Audio("sounds/meta.mp3")
};

sounds.paso.volume = 0.3;
sounds.pared.volume = 0.4;
sounds.meta.volume = 0.5;


// ===========================
//  DIBUJAR LABERINTO
// ===========================

function drawMaze() {
    for (let row = 0; row < walls.length; row++) {
        for (let col = 0; col < walls[row].length; col++) {

            ctx.fillStyle = walls[row][col] === 1 ? "#2c3e50" : "#ecf0f1";
            ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

            ctx.strokeStyle = "#bdc3c7";
            ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
}


// ===========================
//  DIBUJAR META
// ===========================

function drawGoal() {
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(
        goalGridX * CELL_SIZE + PLAYER_OFFSET,
        goalGridY * CELL_SIZE + PLAYER_OFFSET,
        PLAYER_SIZE,
        PLAYER_SIZE
    );
}


// ===========================
//  DIBUJAR JUGADOR
// ===========================

function drawPlayer() {
    const pixelX = playerGridX * CELL_SIZE + PLAYER_OFFSET;
    const pixelY = playerGridY * CELL_SIZE + PLAYER_OFFSET;

    if (imageLoaded) {
        ctx.drawImage(playerImage, pixelX, pixelY, PLAYER_SIZE, PLAYER_SIZE);
    } else {
        ctx.font = `${PLAYER_SIZE * 0.8}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🥊", pixelX + PLAYER_SIZE/2, pixelY + PLAYER_SIZE/2);
    }

    ctx.strokeStyle = "#e74c3c";
    ctx.strokeRect(pixelX - 2, pixelY - 2, PLAYER_SIZE + 4, PLAYER_SIZE + 4);
}


// ===========================
//  FUNCIÓN PRINCIPAL DE DIBUJO
// ===========================

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMaze();
    drawGoal();
    drawPlayer();

    // Mensaje de victoria
    if (playerGridX === goalGridX && playerGridY === goalGridY) {
        ctx.fillStyle = "rgba(46, 204, 113, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("¡GANASTE!", canvas.width / 2, canvas.height / 2);
        ctx.font = "24px Arial";
        ctx.fillText("Di 'reiniciar' para jugar de nuevo", canvas.width / 2, canvas.height / 2 + 50);
    }
}


// ===========================
//  COLISIONES
// ===========================

function isValidPosition(gridX, gridY) {
    return (
        gridX >= 0 &&
        gridX < MAZE_COLS &&
        gridY >= 0 &&
        gridY < MAZE_ROWS &&
        walls[gridY][gridX] === 0
    );
}



//  Sistema de tutorial

function narrar(texto) {
    speechSynthesis.cancel(); 
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = "es-ES";
    utter.rate = 1;
    speechSynthesis.speak(utter);
}

const tutorialSteps = [
    "Bienvenido al laberinto, este juego funciona por voz, para jugar tienes que decir arriba, abajo, izquierda o derecha para moverte.",
];

let tutorialIndex = 0;
let tutorialActivo = true;

function mostrarPasoTutorial() {
    narrar(tutorialSteps[tutorialIndex]);
}


mostrarPasoTutorial();



//  RECONOCIMIENTO DE VOZ


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = true;

    recognition.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        console.log("Comando:", command);

        //Comandos para el tutorial
        if (tutorialActivo) {

    if (command.includes("siguiente")) {
        tutorialIndex++;
        if (tutorialIndex < tutorialSteps.length) {
            mostrarPasoTutorial();
        } else {
            narrar("Tutorial completado. ¡Suerte!");
            tutorialActivo = false;
        }
        return; // Detiene otros comandos
    }

    if (command.includes("repite")) {
        mostrarPasoTutorial();
        return;
    }

    // if (command.includes("comenzar juego")) {
    //     narrar("Iniciando el juego, mucha suerte.");
    //     tutorialActivo = false;
    //     return;
    // }

    // Evita que el jugador se mueva mientras está en tutorial
    return;
}

        // Movimientos
        let newGridX = playerGridX;
        let newGridY = playerGridY;

        if (command.includes("reiniciar")) {
            playerGridX = 1;
            playerGridY = 1;
            draw();
            return;
        }

        if (command.includes("arriba")) newGridY--;
        if (command.includes("abajo")) newGridY++;
        if (command.includes("izquierda")) newGridX--;
        if (command.includes("derecha")) newGridX++;

        // Movimiento válido
        if (isValidPosition(newGridX, newGridY)) {
            playerGridX = newGridX;
            playerGridY = newGridY;

            sounds.paso.play();

            if (playerGridX === goalGridX && playerGridY === goalGridY) {
                sounds.meta.play();
            }
        } else {
            sounds.pared.play();
        }

        draw();
    };

    recognition.start();
    recognition.onend = () => recognition.start();

} else {
    alert("Tu navegador no soporta reconocimiento de voz.");
}


//Control de teclado

document.addEventListener("keydown", (event) => {
    let newGridX = playerGridX;
    let newGridY = playerGridY;

    if (event.key === "ArrowUp") newGridY--;
    if (event.key === "ArrowDown") newGridY++;
    if (event.key === "ArrowLeft") newGridX--;
    if (event.key === "ArrowRight") newGridX++;

    if (event.key === "r") {
        playerGridX = 1;
        playerGridY = 1;
        draw();
        return;
    }

    if (isValidPosition(newGridX, newGridY)) {
        playerGridX = newGridX;
        playerGridY = newGridY;
        draw();
    }
});



draw();
