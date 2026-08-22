const game = document.getElementById("game");
const cat = document.getElementById("cat");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");

// GAME SETTINGS
const MAX_APPLES = 10;
const STARTING_LIVES = 3;

// Cat position
let catX = 50;
let catY = 50;

// Movement speed
const speed = 8;

// Game information
let score = 0;
let lives = STARTING_LIVES;
let gameRunning = true;

// Arrays
let apples = [];
let snakes = [];

// --------------------------------------------------
// SET CAT POSITION
// --------------------------------------------------

function updateCat() {
    cat.style.left = catX + "px";
    cat.style.top = catY + "px";
}

// --------------------------------------------------
// RANDOM POSITION
// --------------------------------------------------

function randomPosition(objectWidth, objectHeight) {

    const maxX = game.clientWidth - objectWidth;
    const maxY = game.clientHeight - objectHeight;

    return {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY)
    };
}

// --------------------------------------------------
// CREATE APPLE
// --------------------------------------------------

function createApple() {

    const apple = document.createElement("div");

    apple.classList.add("apple");
    apple.textContent = "🍎";

    const position = randomPosition(35, 35);

    apple.style.left = position.x + "px";
    apple.style.top = position.y + "px";

    game.appendChild(apple);

    apples.push(apple);
}

// --------------------------------------------------
// CREATE SMALL SNAKE
// --------------------------------------------------

function createSnake() {

    const snake = document.createElement("div");

    snake.classList.add("snake");
    snake.textContent = "🐍";

    const position = randomPosition(45, 25);

    snake.style.left = position.x + "px";
    snake.style.top = position.y + "px";

    game.appendChild(snake);

    snakes.push({
        element: snake,
        x: position.x,
        y: position.y,

        // Random direction
        dx: Math.random() < 0.5 ? 2 : -2,
        dy: Math.random() < 0.5 ? 2 : -2
    });
}

// --------------------------------------------------
// CREATE ALL APPLES
// --------------------------------------------------

function createApples() {

    apples.forEach(apple => apple.remove());

    apples = [];

    for (let i = 0; i < MAX_APPLES; i++) {
        createApple();
    }
}

// --------------------------------------------------
// CREATE SNAKES
// --------------------------------------------------

function createSnakes() {

    snakes.forEach(snake => snake.element.remove());

    snakes = [];

    // Small number of snakes
    for (let i = 0; i < 4; i++) {
        createSnake();
    }
}

// --------------------------------------------------
// COLLISION CHECK
// --------------------------------------------------

function isColliding(rect1, rect2) {

    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

// --------------------------------------------------
// COLLECT APPLES
// --------------------------------------------------

function checkAppleCollision() {

    const catRect = cat.getBoundingClientRect();

    apples.forEach((apple, index) => {

        if (!apple) return;

        const appleRect = apple.getBoundingClientRect();

        if (isColliding(catRect, appleRect)) {

            // Remove apple
            apple.remove();

            apples[index] = null;

            score++;

            scoreDisplay.textContent = score;

            // Check if player won
            if (score >= MAX_APPLES) {
                endGame(true);
            }
        }
    });
}

// --------------------------------------------------
// SNAKE MOVEMENT
// --------------------------------------------------

function moveSnakes() {

    snakes.forEach(snake => {

        if (!gameRunning) return;

        snake.x += snake.dx;
        snake.y += snake.dy;

        // Bounce from left/right walls
        if (
            snake.x <= 0 ||
            snake.x >= game.clientWidth - 45
        ) {
            snake.dx *= -1;
        }

        // Bounce from top/bottom walls
        if (
            snake.y <= 0 ||
            snake.y >= game.clientHeight - 25
        ) {
            snake.dy *= -1;
        }

        snake.element.style.left = snake.x + "px";
        snake.element.style.top = snake.y + "px";
    });
}

// --------------------------------------------------
// CHECK SNAKE COLLISION
// --------------------------------------------------

let hitCooldown = false;

function checkSnakeCollision() {

    if (hitCooldown || !gameRunning) return;

    const catRect = cat.getBoundingClientRect();

    for (const snake of snakes) {

        const snakeRect =
            snake.element.getBoundingClientRect();

        if (isColliding(catRect, snakeRect)) {

            loseLife();

            break;
        }
    }
}

// --------------------------------------------------
// LOSE LIFE
// --------------------------------------------------

function loseLife() {

    if (hitCooldown) return;

    hitCooldown = true;

    lives--;

    livesDisplay.textContent = lives;

    // Make cat blink
    cat.style.opacity = "0.3";

    setTimeout(() => {
        cat.style.opacity = "1";
    }, 150);

    setTimeout(() => {
        hitCooldown = false;
    }, 1000);

    // Game over
    if (lives <= 0) {
        endGame(false);
    }
}

// --------------------------------------------------
// GAME OVER / WIN
// --------------------------------------------------

function endGame(won) {

    gameRunning = false;

    if (won) {

        message.innerHTML =
            "🎉 YOU WIN! 🎉<br><br>" +
            "🐱 You collected all 10 apples! 🍎";

    } else {

        message.innerHTML =
            "💀 GAME OVER 💀<br><br>" +
            "The snake got you! 🐍";
    }

    message.style.display = "block";
}

// --------------------------------------------------
// KEYBOARD MOVEMENT
// --------------------------------------------------

document.addEventListener("keydown", function(event) {

    if (!gameRunning) return;

    const key = event.key.toLowerCase();

    if (
        key === "arrowup" ||
        key === "w"
    ) {
        catY -= speed;
    }

    if (
        key === "arrowdown" ||
        key === "s"
    ) {
        catY += speed;
    }

    if (
        key === "arrowleft" ||
        key === "a"
    ) {
        catX -= speed;
    }

    if (
        key === "arrowright" ||
        key === "d"
    ) {
        catX += speed;
    }

    // Keep cat inside game
    const maxX = game.clientWidth - 60;
    const maxY = game.clientHeight - 60;

    catX = Math.max(0, Math.min(catX, maxX));
    catY = Math.max(0, Math.min(catY, maxY));

    updateCat();
});

// --------------------------------------------------
// RESTART GAME
// --------------------------------------------------

restartButton.addEventListener("click", function() {

    score = 0;
    lives = STARTING_LIVES;

    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;

    catX = 50;
    catY = 50;

    gameRunning = true;
    hitCooldown = false;

    message.style.display = "none";

    updateCat();

    createApples();
    createSnakes();
});

// --------------------------------------------------
// GAME LOOP
// --------------------------------------------------

function gameLoop() {

    if (gameRunning) {

        moveSnakes();

        checkAppleCollision();

        checkSnakeCollision();
    }

    requestAnimationFrame(gameLoop);
}

// --------------------------------------------------
// START GAME
// --------------------------------------------------

updateCat();

createApples();

createSnakes();

gameLoop();






