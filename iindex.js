const game = document.getElementById("game");
const cat = document.getElementById("cat");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const appleGoalDisplay = document.getElementById("appleGoal");
const roundDisplay = document.getElementById("round");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const roundComplete = document.getElementById("roundComplete");
const roundTitle = document.getElementById("roundTitle");
const roundNote = document.getElementById("roundNote");
const nextRoundButton = document.getElementById("nextRoundButton");

const gameOverScreen = document.getElementById("gameOverScreen");
const finalRound = document.getElementById("finalRound");
const restartButton = document.getElementById("restart");
const restartGameButton = document.getElementById("restartGameButton");

const fireworks = document.getElementById("fireworks");


// ========================================
// PHONE BUTTONS
// ========================================

const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");


// ========================================
// GAME SETTINGS
// ========================================

const CAT_SPEED = 10;
const STARTING_LIVES = 5;

let round = 1;
let score = 0;
let lives = STARTING_LIVES;
let appleGoal = 10;

let gameRunning = false;

let apples = [];
let snakes = [];

let catX = 50;
let catY = 50;

let hitCooldown = false;


// ========================================
// MOVEMENT
// ========================================

const movement = {
    up: false,
    down: false,
    left: false,
    right: false
};


// ========================================
// FUNNY ROUND NOTES
// ========================================

const roundNotes = {
    1: "Kaya mo naman pala eh, pero bakit sa akin hirap na hirap ka, emee!!! 😂",
    2: "Ay wow, umabot ka pa dito? 😏",
    3: "Hindi ka pa sumusuko? Sige nga! 😂",
    4: "Medyo seryoso ka na ah! 👀",
    5: "INYAKITDENN! 😂",
    6: "Uy, buhay ka pa! 😭",
    7: "Akala mo madali pa rin? 😈",
    8: "Wag kang kampante! 🐍😂",
    9: "Malapit ka na... or baka hindi. 😏",
    10: "TEKA LANG—PAANO KA UMABOT DITO?! 💀😂"
};


// ========================================
// ROUND MESSAGE
// ========================================

function getRoundNote() {

    if (roundNotes[round]) {
        return roundNotes[round];
    }

    if (round % 5 === 0) {
        return "INYAKITDENN! Umabot ka pa rin?! 😂🔥";
    }

    if (round % 2 === 0) {
        return "Grabe ka, ayaw mo talagang sumuko! 😂";
    }

    return "Round " + round + " pa lang? Tuloy mo lang! 😈🐱";
}


// ========================================
// ROUND SETUP
// ========================================

function setupRound() {

    // More apples every round
    appleGoal = 10 + ((round - 1) * 2);

    appleGoalDisplay.textContent = appleGoal;
    roundDisplay.textContent = round;

    createApples();

    // More snakes as rounds increase
    const snakeCount = Math.min(
        2 + Math.floor((round - 1) / 2),
        8
    );

    createSnakes(snakeCount);
}


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

    const maxX = game.clientWidth - cat.offsetWidth;
    const maxY = game.clientHeight - cat.offsetHeight;

    catX = Math.max(0, Math.min(catX, maxX));
    catY = Math.max(0, Math.min(catY, maxY));
}


// ========================================
// RANDOM POSITION
// ========================================

function randomPosition(width, height) {

    const maxX = Math.max(
        0,
        game.clientWidth - width
    );

    const maxY = Math.max(
        0,
        game.clientHeight - height
    );

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
// CREATE APPLES
// ========================================

function createApples() {

    apples.forEach(apple => {
        if (apple) {
            apple.remove();
        }
    });

    apples = [];


    // Round 10 and above:
    // apples appear one at a time

    if (round >= 10) {

        for (let i = 0; i < appleGoal; i++) {

            setTimeout(() => {

                if (gameRunning) {
                    createApple();
                }

            }, i * 700);
        }

    } else {

        // Normal rounds:
        // all apples appear immediately

        for (let i = 0; i < appleGoal; i++) {
            createApple();
        }
    }
}


// ========================================
// CREATE SNAKE
// ========================================

function createSnake() {

    const snakeElement = document.createElement("div");

    snakeElement.className = "snake";
    snakeElement.textContent = "🐍";

    const position = randomPosition(35, 25);

    snakeElement.style.left = position.x + "px";
    snakeElement.style.top = position.y + "px";

    game.appendChild(snakeElement);

    snakes.push({
        element: snakeElement,
        x: position.x,
        y: position.y
    });
}


// ========================================
// CREATE SNAKES
// ========================================

function createSnakes(count) {

    snakes.forEach(snake => {
        snake.element.remove();
    });

    snakes = [];


    // Round 10 and above:
    // snakes appear one at a time

    if (round >= 10) {

        for (let i = 0; i < count; i++) {

            setTimeout(() => {

                if (gameRunning) {
                    createSnake();
                }

            }, i * 1200);
        }

    } else {

        for (let i = 0; i < count; i++) {
            createSnake();
        }
    }
}


// ========================================
// COLLISION
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
// CHECK APPLE COLLISION
// ========================================

function checkAppleCollision() {

    if (!gameRunning) return;

    const catRect = cat.getBoundingClientRect();

    apples.forEach((apple, index) => {

        if (!apple) return;

        const appleRect = apple.getBoundingClientRect();

        if (isColliding(catRect, appleRect)) {

            apple.remove();

            apples[index] = null;

            score++;

            scoreDisplay.textContent = score;

            if (score >= appleGoal) {
                completeRound();
            }
        }
    });
}


// ========================================
// SNAKE SPEED
// ========================================

function getSnakeSpeed() {

    /*
        Round 1 = very slow

        Snakes gradually get faster.

        Maximum speed = 2.5
    */

    return Math.min(
        0.8 + ((round - 1) * 0.12),
        2.5
    );
}


// ========================================
// MOVE SNAKES TOWARD CAT
// ========================================

function moveSnakes() {

    if (!gameRunning) return;

    const snakeSpeed = getSnakeSpeed();

    snakes.forEach(snake => {

        const catCenterX = catX + 30;
        const catCenterY = catY + 30;

        const snakeCenterX = snake.x + 17;
        const snakeCenterY = snake.y + 12;

        const dx = catCenterX - snakeCenterX;
        const dy = catCenterY - snakeCenterY;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distance > 0) {

            snake.x +=
                (dx / distance) * snakeSpeed;

            snake.y +=
                (dy / distance) * snakeSpeed;
        }


        // Keep snake inside game

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


        snake.element.style.left =
            snake.x + "px";

        snake.element.style.top =
            snake.y + "px";
    });
}


// ========================================
// CHECK SNAKE COLLISION
// ========================================

function checkSnakeCollision() {

    if (!gameRunning || hitCooldown) {
        return;
    }

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


// ========================================
// LOSE LIFE
// ========================================

function loseLife() {

    if (hitCooldown) return;

    hitCooldown = true;

    lives--;

    livesDisplay.textContent = lives;


    // Put cat back to starting position

    catX = 50;
    catY = 50;

    updateCat();


    // Flash cat

    cat.style.opacity = "0.3";

    setTimeout(() => {
        cat.style.opacity = "1";
    }, 300);


    if (lives <= 0) {

        gameOver();

        return;
    }


    // Short protection after getting hit

    setTimeout(() => {
        hitCooldown = false;
    }, 1200);
}


// ========================================
// CAT FIREWORKS
// ========================================

function startCatFireworks() {

    fireworks.innerHTML = "";

    const effects = [
        "🐱",
        "😺",
        "😸",
        "😹",
        "🐈",
        "✨",
        "💥",
        "🎆",
        "🎇"
    ];


    for (let i = 0; i < 45; i++) {

        const item = document.createElement("div");

        item.className = "catFirework";

        item.textContent =
            effects[
                Math.floor(
                    Math.random() * effects.length
                )
                ];


        item.style.left =
            Math.random() * 100 + "%";

        item.style.top =
            Math.random() * 100 + "%";


        item.style.setProperty(
            "--x",
            (Math.random() * 250 - 125) + "px"
        );

        item.style.setProperty(
            "--y",
            (Math.random() * 250 - 125) + "px"
        );


        fireworks.appendChild(item);
    }
}


// ========================================
// COMPLETE ROUND
// ========================================

function completeRound() {

    gameRunning = false;

    stopAllMovement();

    roundTitle.textContent =
        "🎉 ROUND " + round + " COMPLETE! 🎉";

    roundNote.textContent =
        getRoundNote();

    roundComplete.style.display = "flex";

    startCatFireworks();
}


// ========================================
// NEXT ROUND
// ========================================

nextRoundButton.addEventListener(
    "click",
    function () {

        round++;

        score = 0;

        scoreDisplay.textContent = score;

        catX = 50;
        catY = 50;

        updateCat();

        roundComplete.style.display = "none";

        fireworks.innerHTML = "";

        gameRunning = true;

        setupRound();
    }
);


// ========================================
// START GAME
// ========================================

startButton.addEventListener(
    "click",
    function () {

        startScreen.style.display = "none";

        round = 1;

        score = 0;

        lives = STARTING_LIVES;

        scoreDisplay.textContent = score;
        livesDisplay.textContent = lives;

        catX = 50;
        catY = 50;

        updateCat();

        gameRunning = true;

        setupRound();
    }
);


// ========================================
// GAME OVER
// ========================================

function gameOver() {

    gameRunning = false;

    stopAllMovement();

    finalRound.textContent =
        "You reached Round " + round + "! 🏆";

    gameOverScreen.style.display = "flex";
}


// ========================================
// RESTART GAME
// ========================================

function restartGame() {

    round = 1;

    score = 0;

    lives = STARTING_LIVES;

    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;

    catX = 50;
    catY = 50;

    updateCat();

    stopAllMovement();

    hitCooldown = false;


    gameOverScreen.style.display = "none";

    roundComplete.style.display = "none";

    fireworks.innerHTML = "";


    apples.forEach(apple => {
        if (apple) {
            apple.remove();
        }
    });


    snakes.forEach(snake => {
        snake.element.remove();
    });


    apples = [];
    snakes = [];


    startScreen.style.display = "flex";
}


// ========================================
// RESTART BUTTONS
// ========================================

restartButton.addEventListener(
    "click",
    restartGame
);

restartGameButton.addEventListener(
    "click",
    restartGame
);


// ========================================
// KEYBOARD CONTROLS
// ========================================

document.addEventListener(
    "keydown",
    function (event) {

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
    }
);


// ========================================
// KEYBOARD RELEASE
// ========================================

document.addEventListener(
    "keyup",
    function (event) {

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
    }
);


// ========================================
// PHONE CONTROLS
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


    // Phone

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


    // Computer testing

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

setupPhoneButton(upButton, "up");
setupPhoneButton(downButton, "down");
setupPhoneButton(leftButton, "left");
setupPhoneButton(rightButton, "right");


// ========================================
// MOVE CAT
// ========================================

function moveCat() {

    if (!gameRunning) return;


    if (movement.up) {
        catY -= CAT_SPEED;
    }

    if (movement.down) {
        catY += CAT_SPEED;
    }

    if (movement.left) {
        catX -= CAT_SPEED;
    }

    if (movement.right) {
        catX += CAT_SPEED;
    }


    keepCatInside();

    updateCat();
}


// ========================================
// STOP MOVEMENT
// ========================================

function stopAllMovement() {

    movement.up = false;
    movement.down = false;
    movement.left = false;
    movement.right = false;
}


// ========================================
// GAME LOOP
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
// INITIAL STATE
// ========================================

updateCat();

scoreDisplay.textContent = "0";
livesDisplay.textContent = STARTING_LIVES;
appleGoalDisplay.textContent = "10";
roundDisplay.textContent = "1";

gameLoop();