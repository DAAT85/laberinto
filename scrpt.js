const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        // Calculamos el tamaño de celda para que el laberinto ocupe todo el canvas
        const MAZE_COLS = 20;
        const MAZE_ROWS = 15;
        const CELL_SIZE = Math.min(canvas.width / MAZE_COLS, canvas.height / MAZE_ROWS);

        // Ajustamos el canvas para que sea exacto
        canvas.width = MAZE_COLS * CELL_SIZE;
        canvas.height = MAZE_ROWS * CELL_SIZE;

        // Posición inicial del personaje 
        let playerGridX = 1;
        let playerGridY = 1;
        
        // Tamaño del personaje 
        const PLAYER_SIZE = CELL_SIZE * 0.8;
        const PLAYER_OFFSET = (CELL_SIZE - PLAYER_SIZE) / 2;

        //imagen de Yuji
        const playerImage = new Image();
        let imageLoaded = false;
        
        playerImage.src = "img/yuji.png";
        
        playerImage.onload = function() {
            imageLoaded = true;
            console.log("Imagen de Yuji cargada correctamente");
            draw();
        };
        
        playerImage.onerror = function() {
            console.log("Error al cargar la imagen de Yuji, usando emoji como alternativa");
            imageLoaded = false;
        };

        // Matriz del laberinto (1 = pared, 0 = camino)
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

        // Meta del juego (es la posicion)
        const goalGridX = 18;
        const goalGridY = 13;

        function drawMaze() {
            for (let row = 0; row < walls.length; row++) {
                for (let col = 0; col < walls[row].length; col++) {
                    if (walls[row][col] === 1) {
                        //Pared
                        ctx.fillStyle = "#2c3e50"; 
                    } else {
                        //Camino
                        ctx.fillStyle = "#ecf0f1"; 
                    }
                    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    
                    //Borde de las celdas
                    ctx.strokeStyle = "#bdc3c7";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }

        function drawGoal() {
            // Dibujar la meta
            ctx.fillStyle = "#f1c40f"; 
            ctx.fillRect(
                goalGridX * CELL_SIZE + PLAYER_OFFSET, 
                goalGridY * CELL_SIZE + PLAYER_OFFSET, 
                PLAYER_SIZE, 
                PLAYER_SIZE
            );
            
            // Agregar un efecto de brillo
            ctx.fillStyle = "#f39c12";
            ctx.fillRect(
                goalGridX * CELL_SIZE + PLAYER_OFFSET + 5, 
                goalGridY * CELL_SIZE + PLAYER_OFFSET + 5, 
                PLAYER_SIZE - 10, 
                PLAYER_SIZE - 10
            );
        }

        function drawPlayer() {
            // Calcular posición en píxeles
            const pixelX = playerGridX * CELL_SIZE + PLAYER_OFFSET;
            const pixelY = playerGridY * CELL_SIZE + PLAYER_OFFSET;
            
            if (imageLoaded) {
                // Usar la imagen de Yuji
                ctx.drawImage(playerImage, pixelX, pixelY, PLAYER_SIZE, PLAYER_SIZE);
            } else {
                //Si no carga la imagen, carga un emoji
                ctx.font = `${PLAYER_SIZE * 0.8}px Arial`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("🥊", pixelX + PLAYER_SIZE/2, pixelY + PLAYER_SIZE/2);
            }
            
            ctx.strokeStyle = "#e74c3c"; 
            ctx.lineWidth = 2;
            ctx.strokeRect(pixelX - 2, pixelY - 2, PLAYER_SIZE + 4, PLAYER_SIZE + 4);
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawMaze();
            drawGoal();
            drawPlayer();
            
            // Verificar victoria
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

        // Función para verificar si una posición no es pared
        function isValidPosition(gridX, gridY) {
            // Verificar límites
            if (gridX < 0 || gridX >= MAZE_COLS || gridY < 0 || gridY >= MAZE_ROWS) {
                return false;
            }
            // Verificar si no es pared
            return walls[gridY][gridX] === 0;
        }

        // Reconocimiento de voz
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = "es-ES";
            recognition.continuous = true;
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
                console.log("Comando detectado:", command);

                // Guardamos la posición anterior
                let newGridX = playerGridX;
                let newGridY = playerGridY;

                // Verificar comando de reinicio
                if (command.includes("reiniciar") || command.includes("reinicia")) {
                    playerGridX = 1;
                    playerGridY = 1;
                    draw();
                    return;
                }

                // Movimiento con voz
                if (command.includes("arriba") || command.includes("sube")) {
                    newGridY = playerGridY - 1;
                }
                if (command.includes("abajo") || command.includes("baja")) {
                    newGridY = playerGridY + 1;
                }
                if (command.includes("izquierda")) {
                    newGridX = playerGridX - 1;
                }
                if (command.includes("derecha")) {
                    newGridX = playerGridX + 1;
                }

                // Movimiento diagonal
                if (command.includes("diagonal")) {
                    if (command.includes("arriba") && command.includes("derecha")) {
                        newGridX = playerGridX + 1;
                        newGridY = playerGridY - 1;
                    }
                    if (command.includes("arriba") && command.includes("izquierda")) {
                        newGridX = playerGridX - 1;
                        newGridY = playerGridY - 1;
                    }
                    if (command.includes("abajo") && command.includes("derecha")) {
                        newGridX = playerGridX + 1;
                        newGridY = playerGridY + 1;
                    }
                    if (command.includes("abajo") && command.includes("izquierda")) {
                        newGridX = playerGridX - 1;
                        newGridY = playerGridY + 1;
                    }
                }

                // Validar la nueva posición
                if (isValidPosition(newGridX, newGridY)) {
                    playerGridX = newGridX;
                    playerGridY = newGridY;
                } else {
                    console.log("Movimiento bloqueado - hay una pared");
                }

                draw();
            };

            recognition.onerror = (event) => {
                console.log("Error en reconocimiento de voz:", event.error);
            };

            // Iniciar reconocimiento
            recognition.start();
            
            recognition.onend = () => {
                // Reiniciar automáticamente el reconocimiento
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (e) {
                        console.log("Error al reiniciar reconocimiento:", e);
                    }
                }, 1000);
            };

        } else {
            alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.");
        }

        // Dibujo inicial
        draw();

        // También permitir control con teclado para pruebas
        document.addEventListener('keydown', (event) => {
            let newGridX = playerGridX;
            let newGridY = playerGridY;

            switch(event.key) {
                case 'ArrowUp':
                    newGridY = playerGridY - 1;
                    break;
                case 'ArrowDown':
                    newGridY = playerGridY + 1;
                    break;
                case 'ArrowLeft':
                    newGridX = playerGridX - 1;
                    break;
                case 'ArrowRight':
                    newGridX = playerGridX + 1;
                    break;
                case 'r':
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