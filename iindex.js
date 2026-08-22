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
const restartGameButton =
    document.getElementById("restartGameButton");

const fireworks =
    document.getElementById("fireworks");


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

    1:
        "Kaya mo naman pala eh, pero bakit pagdating sa akin hirap na hirap ka, emee!!! 😂",

    2:
        "Ay wow, umabot ka pa dito? 😏",

    3:
        "Hindi ka pa sumusuko? Sige nga! 😂",

    4:
        "Medyo seryoso ka na ah! 👀",

    5:
        "INYAKITDENN! 😂",

    6:
        "Uy, buhay ka pa! 😭",

    7:
        "Akala mo madali pa rin? 😈",

    8:
        "Wag kang kampante! 🐍😂",

    9:
        "Malapit ka na... or baka hindi. 😏",

    10:
        "IMMORTAL YARN?! 💀😂"

};


// ========================================
// GET ROUND NOTE
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

    return "Round " + round +
        " pa lang? Tuloy mo lang! 😈🐱";
}


// ========================================
// ROUND DIFFICULTY
// ========================================

function setupRound() {

    /*
        Round 1 = 10 apples
        Every round adds 2 apples.
    */

    appleGoal =
        10 + ((round - 1) * 2);

    appleGoalDisplay.textContent =
        appleGoal;

    roundDisplay.textContent =
        round;


    /*
        Round 1 = 2 snakes

        Every 2 rounds another snake
        is added.

        Maximum = 8 snakes.
    */

    const snakeCount =
        Math.min(
            2 + Math.floor((round - 1) / 2),
            8
        );

    createApples();

    createSnakes(snakeCount);
}


// ========================================
// UPDATE CAT
// ========================================

function updateCat() {

    cat.style.left =
        catX + "px";

    cat.style.top =
        catY + "px";
}


// ========================================
// KEEP CAT INSIDE GAME
// ========================================

function keepCatInside() {

    const maxX =
        game.clientWidth - 60;

    const maxY =
        game.clientHeight - 60;

    catX =
        Math.max(
            0,
            Math.min(catX, maxX)
        );

    catY =
        Math.max(
            0,
            Math.min(catY, maxY)
        );
}


// ========================================
// RANDOM POSITION
// ========================================

function randomPosition(width, height) {

    const maxX =
        Math.max(
            0,
            game.clientWidth - width
        );

    const maxY =
        Math.max(
            0,
            game.clientHeight - height
        );

    return {

        x:
            Math.floor(
                Math.random() * maxX
            ),

        y:
            Math.floor(
                Math.random() * maxY
            )

    };
}


// ========================================
// CREATE APPLE
// ========================================

function createApple() {

    const apple =
        document.createElement("div");

    apple.className = "apple";

    apple.textContent = "🍎";

    const position =
        randomPosition(35, 35);

    apple.style.left =
        position.x + "px";

    apple.style.top =
        position.y + "px";

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


    /*
        ROUND 10+

        Apples suddenly appear one
        at a time.
    */

    if (round >= 10) {

        for (
            let i = 0;
            i < appleGoal;
            i++
        ) {

            setTimeout(() => {

                if (gameRunning) {
                    createApple();
                }

            }, i * 700);

        }

    } else {

        for (
            let i = 0;
            i < appleGoal;
            i++
        ) {

            createApple();

        }

    }
}


// ========================================
// CREATE SNAKE
// ========================================

function createSnake() {

    const snake =
        document.createElement("div");

    snake.className = "snake";

    snake.textContent = "🐍";

    const position =
        randomPosition(35, 25);

    snake.style.left =
        position.x + "px";

    snake.style.top =
        position.y + "px";

    game.appendChild(snake);

    snakes.push({

        element: snake,

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


    /*
        ROUND 10+

        Snakes suddenly appear one
        at a time.
    */

    if (round >= 10) {

        for (
            let i = 0;
            i < count;
            i++
        ) {

            setTimeout(() => {

                if (gameRunning) {
                    createSnake();
                }

            }, i * 1200);

        }

    } else {

        for (
            let i = 0;
            i < count;
            i++
        ) {

            createSnake();

        }

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
// APPLE COLLISION
// ========================================

function checkAppleCollision() {

    if (!gameRunning) return;

    const catRect =
        cat.getBoundingClientRect();

    apples.forEach((apple, index) => {

        if (!apple) return;

        const appleRect =
            apple.getBoundingClientRect();

        if (
            isColliding(
                catRect,
                appleRect
            )
        ) {

            apple.remove();

            apples[index] = null;

            score++;

            scoreDisplay.textContent =
                score;


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
        ROUND 1:

        0.8 = very slow

        Gradually increases.

        Maximum = 2.5
    */

    return Math.min(
        0.8 +
        (round - 1) * 0.12,

        2.5
    );
}


// ========================================
// MOVE SNAKES TOWARD CAT
// ========================================

function moveSnakes() {

    if (!gameRunning) return;

    const snakeSpeed =
        getSnakeSpeed();

    snakes.forEach(snake => {

        const catCenterX =
            catX + 30;

        const catCenterY =
            catY + 30;


        const snakeCenterX =
            snake.x + 17;

        const snakeCenterY =
            snake.y + 12;


        const dx =
            catCenterX -
            snakeCenterX;

        const dy =
            catCenterY -
            snakeCenterY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance > 0) {

            snake.x +=
                (dx / distance) *
                snakeSpeed;

            snake.y +=
                (dy / distance) *
                snakeSpeed;

        }


        snake.x =
            Math.max(
                0,
                Math.min(
                    snake.x,
                    game.clientWidth - 35
                )
            );


        snake.y =
            Math.max(
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
// SNAKE COLLISION
// ========================================

function checkSnakeCollision() {

    if (
        !gameRunning ||
        hitCooldown
    ) {
        return;
    }

    const catRect =
        cat.getBoundingClientRect();


    for (const snake of snakes) {

        const snakeRect =
            snake.element
                .getBoundingClientRect();


        if (
            isColliding(
                catRect,
                snakeRect
            )
        ) {

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

    livesDisplay.textContent =
        lives;


    catX = 50;
    catY = 50;

    updateCat();


    cat.style.opacity =
        "0.3";


    setTimeout(() => {

        cat.style.opacity =
            "1";

    }, 300);


    if (lives <= 0) {

        gameOver();

        return;

    }


    setTimeout(() => {

        hitCooldown = false;

    }, 1200);
}


// ========================================
// CAT FIREWORKS
// ========================================

function startCatFireworks() {

    fireworks.innerHTML = "";


    const cats = [

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


    for (
        let i = 0;
        i < 45;
        i++
    ) {

        const item =
            document.createElement("div");

        item.className =
            "catFirework";


        item.textContent =
            cats[
                Math.floor(
                    Math.random() *
                    cats.length
                )
                ];


        item.style.left =
            Math.random() * 100 +
            "%";


        item.style.top =
            Math.random() * 100 +
            "%";


        item.style.setProperty(
            "--x",
            (Math.random() * 250 - 125) +
            "px"
        );


        item.style.setProperty(
            "--y",
            (Math.random() * 250 - 125) +
            "px"
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
        "🎉 ROUND " +
        round +
        " COMPLETE! 🎉";


    roundNote.textContent =
        getRoundNote();


    roundComplete.style.display =
        "flex";


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

        scoreDisplay.textContent =
            score;


        catX = 50;
        catY = 50;

        updateCat();


        roundComplete.style.display =
            "none";


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

        startScreen.style.display =
            "none";


        round = 1;

        score = 0;

        lives = STARTING_LIVES;


        scoreDisplay.textContent =
            score;

        livesDisplay.textContent =
            lives;


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
        "You reached Round " +
        round +
        "! 🏆";


    gameOverScreen.style.display =
        "flex";
}


// ========================================
// RESTART GAME
// ========================================

function restartGame() {

    round = 1;

    score = 0;

    lives = STARTING_LIVES;


    scoreDisplay.textContent =
        score;

    livesDisplay.textContent =
        lives;


    catX = 50;
    catY = 50;

    updateCat();


    stopAllMovement();

    hitCooldown = false;


    gameOverScreen.style.display =
        "none";

    roundComplete.style.display =
        "none";

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


    startScreen.style.display =
        "flex";
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

        const key =
            event.key.toLowerCase();


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


// ========================================
// PHONE CONTROLS
// ========================================

function setupPhoneButton(
    button,
    direction
) {

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
}


// ========================================
// PHONE BUTTON MOVEMENT
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
// INITIAL GAME STATE
// ========================================

updateCat();

scoreDisplay.textContent = "0";

livesDisplay.textContent =
    STARTING_LIVES;

appleGoalDisplay.textContent =
    "10";

roundDisplay.textContent =
    "1";

gameLoop();