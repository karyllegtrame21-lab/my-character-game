const game = document.getElementById("game");
const cat = document.getElementById("cat");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");

const message = document.getElementById("message");
const restartButton = document.getElementById("restart");

// PHONE BUTTONS
const upButton = document.getElementById("up");
const downButton = document.getElementById("right");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("down");


// ========================================
// GAME SETTINGS
// ========================================

const MAX_APPLES = 10;

// SPEED IS NOW 10
const speed = 10;

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
// PHONE MOVEMENT
// ========================================

let phoneDirection = {
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

    // SMALL SNAKE
    snake.textContent = "🐍";

    const position = randomPosition(35, 25);

    snake.style.left = position.x + "px";
    snake.style.top = position.y + "px";

    game.appendChild(snake);

    snakes.push({

        element: snake,

        x: position.x,
        y: position.y,

        dx: Math.random() < 0.5 ? 2 : -2,
        dy: Math.random() < 0.5 ? 2 : -2

    });
}


// ========================================
// CREATE SNAKES
// ========================================

function createSnakes() {

    snakes.forEach(snake => {

        snake.element.remove();

    });

    snakes = [];

    // 4 small snakes
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

            // WIN
            if (score >= MAX_APPLES) {

                endGame(true);

            }

        }

    });
}


// ========================================
// MOVE SNAKES
// ========================================

function moveSnakes() {

    if (!gameRunning) return;

    snakes.forEach(snake => {

        snake.x += snake.dx;
        snake.y += snake.dy;

        // LEFT / RIGHT WALL
        if (
            snake.x <= 0 ||
            snake.x >= game.clientWidth - 35
        ) {

            snake.dx *= -1;

        }

        // TOP / BOTTOM WALL
        if (
            snake.y <= 0 ||
            snake.y >= game.clientHeight - 25
        ) {

            snake.dy *= -1;

        }

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

    if (!gameRunning) return;

    if (hitCooldown) return;

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

    // Move cat back to starting position
    catX = 50;
    catY = 50;

    updateCat();

    // Cat briefly becomes transparent
    cat.style.opacity = "0.3";

    setTimeout(function() {

        cat.style.opacity = "1";

    }, 300);


    // GAME OVER
    if (lives <= 0) {

        endGame(false);

        return;

    }


    // Prevent instant repeated collision
    setTimeout(function() {

        hitCooldown = false;

    }, 1200);

}


// ========================================
// WIN / GAME OVER
// ========================================

function endGame(won) {

    gameRunning = false;

    // Stop phone movement
    phoneDirection.up = false;
    phoneDirection.down = false;
    phoneDirection.left = false;
    phoneDirection.right = false;


    if (won) {

        message.innerHTML =

            "🎉 YOU WIN! 🎉" +
            "<br><br>" +
            "🐱 You collected all 10 apples! 🍎";

    } else {

        message.innerHTML =

            "💀 GAME OVER 💀" +
            "<br><br>" +
            "🐍 The snake got you!";

    }


    message.style.display = "block";

}


// ========================================
// KEYBOARD CONTROLS
// ========================================

document.addEventListener("keydown", function(event) {

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

        phoneDirection.up = true;

    }


    if (
        key === "arrowdown" ||
        key === "s"
    ) {

        phoneDirection.down = true;

    }


    if (
        key === "arrowleft" ||
        key === "a"
    ) {

        phoneDirection.left = true;

    }


    if (
        key === "arrowright" ||
        key === "d"
    ) {

        phoneDirection.right = true;

    }

});


// ========================================
// KEYBOARD RELEASE
// ========================================

document.addEventListener("keyup", function(event) {

    const key = event.key.toLowerCase();


    if (
        key === "arrowup" ||
        key === "w"
    ) {

        phoneDirection.up = false;

    }


    if (
        key === "arrowdown" ||
        key === "s"
    ) {

        phoneDirection.down = false;

    }


    if (
        key === "arrowleft" ||
        key === "a"
    ) {

        phoneDirection.left = false;

    }


    if (
        key === "arrowright" ||
        key === "d"
    ) {

        phoneDirection.right = false;

    }

});


// ========================================
// PHONE BUTTON FUNCTION
// ========================================

function setupPhoneButton(button, direction) {

    if (!button) return;


    // START MOVING
    function startMove(event) {

        event.preventDefault();

        if (!gameRunning) return;

        phoneDirection[direction] = true;

    }


    // STOP MOVING
    function stopMove(event) {

        event.preventDefault();

        phoneDirection[direction] = false;

    }


    // Touch
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


    // Mouse
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
// ACTIVATE PHONE BUTTONS
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


    if (phoneDirection.up) {

        catY -= speed;

    }


    if (phoneDirection.down) {

        catY += speed;

    }


    if (phoneDirection.left) {

        catX -= speed;

    }


    if (phoneDirection.right) {

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
    function() {

        score = 0;

        lives = STARTING_LIVES;

        scoreDisplay.textContent = score;

        livesDisplay.textContent = lives;

        catX = 50;

        catY = 50;

        gameRunning = true;

        hitCooldown = false;


        phoneDirection.up = false;
        phoneDirection.down = false;
        phoneDirection.left = false;
        phoneDirection.right = false;


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