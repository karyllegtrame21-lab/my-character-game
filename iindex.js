const game = document.getElementById("game");
const cat = document.getElementById("cat");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");

const message = document.getElementById("message");
const restartButton = document.getElementById("restart");

// PHONE BUTTONS
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");


// ========================================
// GAME SETTINGS
// ========================================

const MAX_APPLES = 10;

// CAT SPEED
const speed = 10;

// STARTING LIVES
const STARTING_LIVES = 5;


// ========================================
// CAT POSITION
// ========================================

let catX = 50;
let catY = 50;


// ========================================
// GAME VARIABLES
// ========================================

let score = 0;
let lives = STARTING_LIVES;

let gameRunning = true;

let apples = [];
let snakes = [];


// ========================================
// MOVEMENT STATE
// ========================================

const movement = {
    up: false,
    down: false,
    left: false,
    right: false
};


// ========================================
// UPDATE CAT
// ========================================

function updateCat() {
    cat.style.left = catX + "px";
    cat.style.top = catY + "px";
}


// ========================================
// KEEP CAT INSIDE GAME
// ========================================

function keepCatInside() {

    const maxX = game.clientWidth - 60;
    const maxY = game.clientHeight - 60;

    catX = Math.max(0, Math.min(catX, maxX));
    catY = Math.max(0, Math.min(catY, maxY));
}


// ========================================
// RANDOM POSITION
// ========================================

function randomPosition(width, height) {

    const maxX = Math.max(0, game.clientWidth - width);
    const maxY = Math.max(0, game.clientHeight - height);

    return {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY)
    };
}


// ========================================
// CREATE APPLE
// ========================================

function createApple() {

    const apple = document.createElement("div");

    apple.className = "apple";
    apple.textContent = "🍎";

    const position = randomPosition(35, 35);

    apple.style.left = position.x + "px";
    apple.style.top = position.y + "px";

    game.appendChild(apple);

    apples.push(apple);
}


// ========================================
// CREATE 10 APPLES
// ========================================

function createApples() {

    apples.forEach(apple => {

        if (apple) {
            apple.remove();
        }

    });

    apples = [];

    for (let i = 0; i < MAX_APPLES; i++) {
        createApple();
    }
}


// ========================================
// CREATE SMALL SNAKE
// ========================================

function createSnake() {

    const snake = document.createElement("div");

    snake.className = "snake";
    snake.textContent = "🐍";

    const position = randomPosition(35, 25);

    snake.style.left = position.x + "px";
    snake.style.top = position.y + "px";

    game.appendChild(snake);

    snakes.push({

        element: snake,

        x: position.x,
        y: position.y

    });
}


// ========================================
// CREATE 4 SNAKES
// ========================================

function createSnakes() {

    snakes.forEach(snake => {
        snake.element.remove();
    });

    snakes = [];

    for (let i = 0; i < 4; i++) {
        createSnake();
    }
}


// ========================================
// COLLISION DETECTION
// ========================================

function isColliding(rect1, rect2) {

    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}


// ========================================
// CHECK APPLES
// ========================================

function checkAppleCollision() {

    if (!gameRunning) return;

    const catRect = cat.getBoundingClientRect();

    apples.forEach((apple, index) => {

        if (!apple) return;

        const appleRect =
            apple.getBoundingClientRect();

        if (isColliding(catRect, appleRect)) {

            apple.remove();

            apples[index] = null;

            score++;

            scoreDisplay.textContent = score;

            if (score >= MAX_APPLES) {
                endGame(true);
            }
        }
    });
}


// ========================================
// MOVE SNAKES TOWARD CAT
// ========================================

function moveSnakes() {

    if (!gameRunning) return;

    // SNAKE SPEED
    // Lower number = slower snake
    const snakeSpeed = 1.2;

    snakes.forEach(snake => {

        // CAT CENTER
        const catCenterX = catX + 30;
        const catCenterY = catY + 30;

        // SNAKE CENTER
        const snakeCenterX = snake.x + 17;
        const snakeCenterY = snake.y + 12;

        // DISTANCE FROM SNAKE TO CAT
        const dx = catCenterX - snakeCenterX;
        const dy = catCenterY - snakeCenterY;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        // CRAWL TOWARD CAT
        if (distance > 0) {

            snake.x +=
                (dx / distance) * snakeSpeed;

            snake.y +=
                (dy / distance) * snakeSpeed;

        }

        // KEEP SNAKE INSIDE GAME
        snake.x = Math.max(
            0,
            Math.min(
                snake.x,
                game.clientWidth - 35
            )
        );

        snake.y = Math.max(
            0,
            Math.min(
                snake.y,
                game.clientHeight - 25
            )
        );

        // UPDATE SNAKE POSITION
        snake.element.style.left =
            snake.x + "px";

        snake.element.style.top =
            snake.y + "px";

    });
}


// ========================================
// SNAKE COLLISION
// ========================================

let hitCooldown = false;

function checkSnakeCollision() {

    if (!gameRunning || hitCooldown) return;

    const catRect =
        cat.getBoundingClientRect();

    for (const snake of snakes) {

        const snakeRect =
            snake.element.getBoundingClientRect();

        if (isColliding(catRect, snakeRect)) {

            loseLife();

            break;
        }
    }
}


// ========================================
// LOSE LIFE
// ========================================

function loseLife() {

    if (hitCooldown) return;

    hitCooldown = true;

    lives--;

    livesDisplay.textContent = lives;

    // MOVE CAT BACK
    catX = 50;
    catY = 50;

    updateCat();

    // CAT FLASHES
    cat.style.opacity = "0.3";

    setTimeout(function () {
        cat.style.opacity = "1";
    }, 300);


    // GAME OVER
    if (lives <= 0) {

        endGame(false);

        return;
    }


    // COLLISION COOLDOWN
    setTimeout(function () {
        hitCooldown = false;
    }, 1200);
}


// ========================================
// WIN / GAME OVER
// ========================================

function endGame(won) {

    gameRunning = false;

    stopAllMovement();

    if (won) {

        message.innerHTML =
            "🎉 YOU WIN! 🎉" +
            "<br><br>" +
            "🐱 You collected all 10 apples! 🍎";

    } else {

        message.innerHTML =
            "💀 GAME OVER 💀" +
            "<br><br>" +
            "🐍 The snakes got you!";
    }

    message.style.display = "block";
}


// ========================================
// STOP ALL MOVEMENT
// ========================================

function stopAllMovement() {

    movement.up = false;
    movement.down = false;
    movement.left = false;
    movement.right = false;
}


// ========================================
// KEYBOARD CONTROLS
// ========================================

document.addEventListener("keydown", function (event) {

    if (!gameRunning) return;

    const key = event.key.toLowerCase();

    if (
        key === "arrowup" ||
        key === "arrowdown" ||
        key === "arrowleft" ||
        key === "arrowright" ||
        key === "w" ||
        key === "a" ||
        key === "s" ||
        key === "d"
    ) {
        event.preventDefault();
    }


    if (
        key === "arrowup" ||
        key === "w"
    ) {
        movement.up = true;
    }


    if (
        key === "arrowdown" ||
        key === "s"
    ) {
        movement.down = true;
    }


    if (
        key === "arrowleft" ||
        key === "a"
    ) {
        movement.left = true;
    }


    if (
        key === "arrowright" ||
        key === "d"
    ) {
        movement.right = true;
    }

});


// ========================================
// KEYBOARD RELEASE
// ========================================

document.addEventListener("keyup", function (event) {

    const key = event.key.toLowerCase();

    if (
        key === "arrowup" ||
        key === "w"
    ) {
        movement.up = false;
    }

    if (
        key === "arrowdown" ||
        key === "s"
    ) {
        movement.down = false;
    }

    if (
        key === "arrowleft" ||
        key === "a"
    ) {
        movement.left = false;
    }

    if (
        key === "arrowright" ||
        key === "d"
    ) {
        movement.right = false;
    }

});


// ========================================
// PHONE BUTTONS
// ========================================

function setupPhoneButton(button, direction) {

    if (!button) return;


    function startMove(event) {

        event.preventDefault();

        if (!gameRunning) return;

        movement[direction] = true;
    }


    function stopMove(event) {

        event.preventDefault();

        movement[direction] = false;
    }


    // TOUCH
    button.addEventListener(
        "touchstart",
        startMove,
        { passive: false }
    );

    button.addEventListener(
        "touchend",
        stopMove,
        { passive: false }
    );

    button.addEventListener(
        "touchcancel",
        stopMove,
        { passive: false }
    );


    // MOUSE
    button.addEventListener(
        "mousedown",
        startMove
    );

    button.addEventListener(
        "mouseup",
        stopMove
    );

    button.addEventListener(
        "mouseleave",
        stopMove
    );
}


// ========================================
// CONNECT PHONE BUTTONS
// ========================================

setupPhoneButton(
    upButton,
    "up"
);

setupPhoneButton(
    downButton,
    "down"
);

setupPhoneButton(
    leftButton,
    "left"
);

setupPhoneButton(
    rightButton,
    "right"
);


// ========================================
// MOVE CAT
// ========================================

function moveCat() {

    if (!gameRunning) return;


    if (movement.up) {
        catY -= speed;
    }


    if (movement.down) {
        catY += speed;
    }


    if (movement.left) {
        catX -= speed;
    }


    if (movement.right) {
        catX += speed;
    }


    keepCatInside();

    updateCat();
}


// ========================================
// RESTART GAME
// ========================================

restartButton.addEventListener(
    "click",
    function () {

        score = 0;

        lives = STARTING_LIVES;

        scoreDisplay.textContent = score;

        livesDisplay.textContent = lives;

        catX = 50;
        catY = 50;

        gameRunning = true;

        hitCooldown = false;

        stopAllMovement();

        message.style.display = "none";

        cat.style.opacity = "1";

        updateCat();

        createApples();

        createSnakes();

    }
);


// ========================================
// MAIN GAME LOOP
// ========================================

function gameLoop() {

    if (gameRunning) {

        moveCat();

        moveSnakes();

        checkAppleCollision();

        checkSnakeCollision();

    }

    requestAnimationFrame(gameLoop);
}


// ========================================
// START GAME
// ========================================

updateCat();

createApples();

createSnakes();

gameLoop();