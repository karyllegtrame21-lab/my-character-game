/* =========================================================
   MEOWPLE RUSH
   ========================================================= */


/* =========================
   GAME SETTINGS
========================= */

const APPLE_GOAL = 10;
const STARTING_LIVES = 5;
const CAT_SPEED = 5;
const NUMBER_OF_SNAKES = 4;
const SNAKE_SPEED = 1.5;
const SNAKE_MOVE_INTERVAL = 70;


/* =========================
   WITTY ROUND NOTES
========================= */

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
    10: "IMMORTAL YARN! 🔥🐱"
};


/* =========================
   ELEMENTS
========================= */

const game = document.getElementById("game");
const cat = document.getElementById("cat");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const roundDisplay = document.getElementById("round");

const startScreen = document.getElementById("startScreen");
const roundComplete = document.getElementById("roundComplete");
const pauseScreen = document.getElementById("pauseScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startButton = document.getElementById("startButton");
const nextRoundButton = document.getElementById("nextRoundButton");
const restartButton = document.getElementById("restart");
const restartGameButton = document.getElementById("restartGameButton");
const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");

const roundTitle = document.getElementById("roundTitle");
const roundNote = document.getElementById("roundNote");
const gameOverNote = document.getElementById("gameOverNote");
const finalRound = document.getElementById("finalRound");

const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");


/* =========================
   GAME VARIABLES
========================= */

let score = 0;
let lives = STARTING_LIVES;
let round = 1;

let gameRunning = false;
let gamePaused = false;

let catX = 0;
let catY = 0;

let apples = [];
let snakes = [];

let animationFrame = null;
let snakeTimer = null;

const movement = {
    up: false,
    down: false,
    left: false,
    right: false
};


/* =========================
   DISPLAY
========================= */

function updateDisplay() {

    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    roundDisplay.textContent = round;

}


/* =========================
   GAME DIMENSIONS
========================= */

function getGameWidth() {
    return game.clientWidth;
}

function getGameHeight() {
    return game.clientHeight;
}


/* =========================
   CAT START POSITION
========================= */

function positionCatAtStart() {

    const width = getGameWidth();
    const height = getGameHeight();

    catX = Math.max(
        20,
        Math.floor(width * 0.08)
    );

    catY = Math.max(
        20,
        Math.floor(height * 0.78)
    );

    keepCatInsideGame();
    updateCatPosition();

}


/* =========================
   KEEP CAT INSIDE
========================= */

function keepCatInsideGame() {

    const maxX =
        getGameWidth() - cat.offsetWidth;

    const maxY =
        getGameHeight() - cat.offsetHeight;

    catX = Math.max(
        0,
        Math.min(catX, maxX)
    );

    catY = Math.max(
        0,
        Math.min(catY, maxY)
    );

}


/* =========================
   UPDATE CAT
========================= */

function updateCatPosition() {

    cat.style.left = `${catX}px`;
    cat.style.top = `${catY}px`;

}


/* =========================
   START GAME
========================= */

function startGame() {

    score = 0;
    lives = STARTING_LIVES;
    round = 1;

    gameRunning = true;
    gamePaused = false;

    clearObjectsOnly();

    positionCatAtStart();
    updateDisplay();

    startScreen.style.display = "none";
    roundComplete.style.display = "none";
    pauseScreen.style.display = "none";
    gameOverScreen.style.display = "none";

    pauseButton.textContent = "⏸️ Pause";

    createRound();
    startGameLoop();

}


/* =========================
   CREATE ROUND
========================= */

function createRound() {

    clearObjectsOnly();

    /*
       Every round starts with
       the original 5 lives.
    */

    lives = STARTING_LIVES;
    score = 0;

    updateDisplay();

    positionCatAtStart();

    createApples();
    createSnakes();

}


/* =========================
   CREATE APPLES
========================= */

function createApples() {

    apples = [];

    for (let i = 0; i < APPLE_GOAL; i++) {

        createApple();

    }

}


/* =========================
   CREATE APPLE
========================= */

function createApple() {

    const apple = document.createElement("div");

    apple.className = "apple";
    apple.textContent = "🍎";

    let position;
    let attempts = 0;

    do {

        position = getRandomPosition(40, 40);
        attempts++;

    } while (
        isNearCat(
            position.x,
            position.y,
            130
        ) &&
        attempts < 100
        );

    apple.style.left =
        `${position.x}px`;

    apple.style.top =
        `${position.y}px`;

    game.appendChild(apple);

    apples.push({
        element: apple,
        x: position.x,
        y: position.y
    });

}


/* =========================
   CREATE SNAKES
========================= */

function createSnakes() {

    snakes = [];

    const positions = [
        { x: 0.78, y: 0.10 },
        { x: 0.86, y: 0.68 },
        { x: 0.55, y: 0.08 },
        { x: 0.18, y: 0.12 }
    ];

    for (
        let i = 0;
        i < NUMBER_OF_SNAKES;
        i++
    ) {

        createSnake(
            positions[i % positions.length]
        );

    }

}


/* =========================
   CREATE SNAKE
========================= */

function createSnake(anchor) {

    const snake = document.createElement("div");

    snake.className = "snake";
    snake.textContent = "🐍";

    const width = getGameWidth();
    const height = getGameHeight();

    let x =
        Math.floor(width * anchor.x);

    let y =
        Math.floor(height * anchor.y);

    x = Math.max(
        10,
        Math.min(x, width - 55)
    );

    y = Math.max(
        10,
        Math.min(y, height - 45)
    );

    /*
       Make absolutely sure that a snake
       does not spawn directly on the cat.
    */

    if (
        distance(
            x,
            y,
            catX,
            catY
        ) < 180
    ) {

        x = width - 70;
        y = 25;

    }

    snake.style.left = `${x}px`;
    snake.style.top = `${y}px`;

    game.appendChild(snake);

    const angle =
        Math.random() * Math.PI * 2;

    snakes.push({

        element: snake,

        x: x,
        y: y,

        dx:
            Math.cos(angle) *
            SNAKE_SPEED,

        dy:
            Math.sin(angle) *
            SNAKE_SPEED,

        changeDirectionTimer: 0

    });

}


/* =========================
   RANDOM POSITION
========================= */

function getRandomPosition(
    objectWidth,
    objectHeight
) {

    const maxX =
        Math.max(
            5,
            getGameWidth() -
            objectWidth -
            5
        );

    const maxY =
        Math.max(
            5,
            getGameHeight() -
            objectHeight -
            5
        );

    return {

        x: Math.floor(
            Math.random() * maxX
        ),

        y: Math.floor(
            Math.random() * maxY
        )

    };

}


/* =========================
   DISTANCE
========================= */

function distance(
    x1,
    y1,
    x2,
    y2
) {

    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(
        dx * dx + dy * dy
    );

}


/* =========================
   NEAR CAT
========================= */

function isNearCat(
    x,
    y,
    minimumDistance
) {

    return (
        distance(
            x,
            y,
            catX,
            catY
        ) < minimumDistance
    );

}


/* =========================
   CLEAR OBJECTS
========================= */

function clearObjectsOnly() {

    document
        .querySelectorAll(".apple")
        .forEach(
            element => element.remove()
        );

    document
        .querySelectorAll(".snake")
        .forEach(
            element => element.remove()
        );

    apples = [];
    snakes = [];

}


/* =========================
   GAME LOOP
========================= */

function startGameLoop() {

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

    }

    function loop() {

        if (
            gameRunning &&
            !gamePaused
        ) {

            moveCat();

            checkAppleCollisions();

            checkSnakeCollisions();

        }

        animationFrame =
            requestAnimationFrame(loop);

    }

    loop();

}


/* =========================
   MOVE CAT
========================= */

function moveCat() {

    let moving = false;

    if (movement.up) {
        catY -= CAT_SPEED;
        moving = true;
    }

    if (movement.down) {
        catY += CAT_SPEED;
        moving = true;
    }

    if (movement.left) {
        catX -= CAT_SPEED;
        moving = true;
    }

    if (movement.right) {
        catX += CAT_SPEED;
        moving = true;
    }

    keepCatInsideGame();
    updateCatPosition();

    if (moving) {
        cat.classList.add("moving");
    } else {
        cat.classList.remove("moving");
    }

}


/* =========================
   DESKTOP KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();

        if (
            [
                "arrowup",
                "arrowdown",
                "arrowleft",
                "arrowright",
                "w",
                "a",
                "s",
                "d",
                " "
            ].includes(key)
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

        if (
            key === " " &&
            gameRunning
        ) {
            togglePause();
        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        const key =
            event.key.toLowerCase();

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


/* =========================
   STOP MOVEMENT
========================= */

function stopMovement() {

    movement.up = false;
    movement.down = false;
    movement.left = false;
    movement.right = false;

    cat.classList.remove("moving");

}


/* =========================
   MOBILE CONTROLS
========================= */

function setupMoveButton(
    button,
    direction
) {

    if (!button) {
        return;
    }

    function startMove(event) {

        event.preventDefault();

        if (
            !gameRunning ||
            gamePaused
        ) {
            return;
        }

        movement[direction] = true;

        button.classList.add("active");

    }

    function stopMove(event) {

        event.preventDefault();

        movement[direction] = false;

        button.classList.remove("active");

    }

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

    button.addEventListener(
        "pointerdown",
        startMove
    );

    button.addEventListener(
        "pointerup",
        stopMove
    );

    button.addEventListener(
        "pointercancel",
        stopMove
    );

}


setupMoveButton(upButton, "up");
setupMoveButton(downButton, "down");
setupMoveButton(leftButton, "left");
setupMoveButton(rightButton, "right");


/* =========================
   MOVE SNAKES
========================= */

function moveSnakes() {

    if (
        !gameRunning ||
        gamePaused
    ) {
        return;
    }

    const width = getGameWidth();
    const height = getGameHeight();

    snakes.forEach(
        snake => {

            snake.changeDirectionTimer++;

            if (
                snake.changeDirectionTimer >
                30 + Math.random() * 80
            ) {

                const angle =
                    Math.random() *
                    Math.PI *
                    2;

                snake.dx =
                    Math.cos(angle) *
                    SNAKE_SPEED;

                snake.dy =
                    Math.sin(angle) *
                    SNAKE_SPEED;

                snake.changeDirectionTimer = 0;

            }

            snake.x += snake.dx;
            snake.y += snake.dy;

            if (
                snake.x <= 5 ||
                snake.x >= width - 50
            ) {

                snake.dx *= -1;

                snake.x =
                    Math.max(
                        5,
                        Math.min(
                            snake.x,
                            width - 50
                        )
                    );

            }

            if (
                snake.y <= 5 ||
                snake.y >= height - 40
            ) {

                snake.dy *= -1;

                snake.y =
                    Math.max(
                        5,
                        Math.min(
                            snake.y,
                            height - 40
                        )
                    );

            }

            snake.element.style.left =
                `${snake.x}px`;

            snake.element.style.top =
                `${snake.y}px`;

        }
    );

}


/* =========================
   SNAKE TIMER
========================= */

snakeTimer = setInterval(
    moveSnakes,
    SNAKE_MOVE_INTERVAL
);


/* =========================
   APPLE COLLISIONS
========================= */

function checkAppleCollisions() {

    for (
        let i = apples.length - 1;
        i >= 0;
        i--
    ) {

        const apple = apples[i];

        if (
            objectsCollide(
                catX,
                catY,
                45,
                45,
                apple.x,
                apple.y,
                35,
                35
            )
        ) {

            apple.element.remove();

            apples.splice(i, 1);

            score++;

            updateDisplay();

            if (
                score >= APPLE_GOAL
            ) {

                completeRound();

            }

        }

    }

}


/* =========================
   SNAKE COLLISIONS
========================= */

function checkSnakeCollisions() {

    for (
        let i = 0;
        i < snakes.length;
        i++
    ) {

        const snake = snakes[i];

        if (
            objectsCollide(
                catX,
                catY,
                45,
                45,
                snake.x,
                snake.y,
                40,
                35
            )
        ) {

            loseLife();

            break;

        }

    }

}


/* =========================
   COLLISION CHECK
========================= */

function objectsCollide(
    x1,
    y1,
    w1,
    h1,
    x2,
    y2,
    w2,
    h2
) {

    return (
        x1 < x2 + w2 &&
        x1 + w1 > x2 &&
        y1 < y2 + h2 &&
        y1 + h1 > y2
    );

}


/* =========================
   LOSE LIFE
========================= */

function loseLife() {

    if (
        !gameRunning ||
        gamePaused
    ) {
        return;
    }

    lives--;

    updateDisplay();

    positionCatAtStart();

    stopMovement();

    cat.style.opacity = "0.35";

    setTimeout(
        function() {

            cat.style.opacity = "1";

        },
        700
    );

    if (lives <= 0) {

        endGame();

    }

}


/* =========================
   COMPLETE ROUND
========================= */

function completeRound() {

    if (!gameRunning) {
        return;
    }

    gameRunning = false;

    stopMovement();

    clearObjectsOnly();

    roundTitle.textContent =
        `🎉 ROUND ${round} COMPLETE! 🎉`;

    /*
       Restore the original witty note.
    */

    roundNote.textContent =
        roundNotes[round] ||
        "You made it! 🐱";

    roundComplete.style.display =
        "flex";

}


/* =========================
   NEXT ROUND
========================= */

function nextRound() {

    round++;

    /*
       Every new round restores
       the original 5 lives.
    */

    lives = STARTING_LIVES;
    score = 0;

    gameRunning = true;
    gamePaused = false;

    updateDisplay();

    roundComplete.style.display = "none";
    pauseScreen.style.display = "none";

    pauseButton.textContent = "⏸️ Pause";

    positionCatAtStart();

    createRound();

}


/* =========================
   GAME OVER
========================= */

function endGame() {

    gameRunning = false;
    gamePaused = false;

    stopMovement();

    clearObjectsOnly();

    gameOverNote.textContent =
        "PUYOT! 😂";

    finalRound.textContent =
        `You reached Round ${round}.`;

    gameOverScreen.style.display =
        "flex";

}


/* =========================
   PAUSE
========================= */

function togglePause() {

    if (!gameRunning) {
        return;
    }

    gamePaused = !gamePaused;

    if (gamePaused) {

        stopMovement();

        pauseScreen.style.display =
            "flex";

        pauseButton.textContent =
            "▶️ Resume";

    } else {

        pauseScreen.style.display =
            "none";

        pauseButton.textContent =
            "⏸️ Pause";

    }

}


/* =========================
   RESTART
========================= */

function restartGame() {

    stopMovement();

    gameRunning = false;
    gamePaused = false;

    clearObjectsOnly();

    score = 0;
    lives = STARTING_LIVES;
    round = 1;

    updateDisplay();

    positionCatAtStart();

    roundComplete.style.display = "none";
    pauseScreen.style.display = "none";
    gameOverScreen.style.display = "none";
    startScreen.style.display = "flex";

    pauseButton.textContent =
        "⏸️ Pause";

}


/* =========================
   BUTTON EVENTS
========================= */

startButton.addEventListener(
    "click",
    startGame
);

nextRoundButton.addEventListener(
    "click",
    nextRound
);

restartButton.addEventListener(
    "click",
    restartGame
);

restartGameButton.addEventListener(
    "click",
    startGame
);

pauseButton.addEventListener(
    "click",
    togglePause
);

resumeButton.addEventListener(
    "click",
    togglePause
);


/* =========================
   PREVENT PHONE SCROLLING
========================= */

document.addEventListener(
    "touchmove",
    function(event) {

        if (
            event.target.closest(
                "#mobileControls"
            )
        ) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);


/* =========================
   RESIZE
========================= */

window.addEventListener(
    "resize",
    function() {

        keepCatInsideGame();

        updateCatPosition();

        const width =
            getGameWidth();

        const height =
            getGameHeight();

        snakes.forEach(
            snake => {

                snake.x =
                    Math.min(
                        snake.x,
                        width - 50
                    );

                snake.y =
                    Math.min(
                        snake.y,
                        height - 40
                    );

                snake.element.style.left =
                    `${snake.x}px`;

                snake.element.style.top =
                    `${snake.y}px`;

            }
        );

    }
);


/* =========================
   INITIAL STATE
========================= */

updateDisplay();

positionCatAtStart();

restartGame();