// ============================================================
// MEOWPLE RUSH
// Complete Game JavaScript
// ============================================================


// ============================================================
// GET HTML ELEMENTS
// ============================================================

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


// ============================================================
// PAUSE BUTTON
// ============================================================

const pauseButton = document.getElementById("pauseButton");


// ============================================================
// PHONE BUTTONS
// ============================================================

const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");


// ============================================================
// GAME SETTINGS
// ============================================================

const STARTING_LIVES = 5;

// Slightly slower movement so it is easier to control
const CAT_SPEED = 7;


// ============================================================
// GAME VARIABLES
// ============================================================

let round = 1;

let score = 0;

let lives = STARTING_LIVES;

let appleGoal = 10;

let gameRunning = false;

let gamePaused = false;

let apples = [];

let snakes = [];

let catX = 50;

let catY = 50;

let hitCooldown = false;


// ============================================================
// MOVEMENT
// ============================================================

const movement = {

    up: false,

    down: false,

    left: false,

    right: false

};


// ============================================================
// FUNNY ROUND NOTES
// ============================================================

const roundNotes = {

    1:
        "Kaya mo naman pala eh, pero bakit sa akin hirap na hirap ka, emee!!! 😂",

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
        "IMMORTAL YARN 😭🔥",

};


// ============================================================
// GET ROUND NOTE
// ============================================================

function getRoundNote() {

    if (roundNotes[round]) {

        return roundNotes[round];

    }


    // Every 5th round

    if (round % 5 === 0) {

        return "INYAKITDENN! Umabot ka pa rin?! 😂🔥";

    }


    // Even rounds

    if (round % 2 === 0) {

        return "Grabe ka, ayaw mo talagang sumuko! 😂";

    }


    // Infinite rounds

    return (
        "Round " +
        round +
        " pa lang? Tuloy mo lang! 😈🐱"
    );

}


// ============================================================
// ROUND SETUP
// ============================================================

function setupRound() {

    // More apples every round

    appleGoal =
        10 +
        ((round - 1) * 2);


    appleGoalDisplay.textContent =
        appleGoal;

    roundDisplay.textContent =
        round;


    // Reset lives every round

    lives =
        STARTING_LIVES;

    livesDisplay.textContent =
        lives;


    // Reset collision protection

    hitCooldown = false;


    // Put cat back at starting area

    catX = 50;

    catY = 50;

    updateCat();


    // Create apples

    createApples();


    // Increase snakes gradually

    const snakeCount =
        Math.min(
            2 + Math.floor((round - 1) / 2),
            8
        );


    createSnakes(snakeCount);

}


// ============================================================
// UPDATE CAT POSITION
// ============================================================

function updateCat() {

    cat.style.left =
        catX + "px";

    cat.style.top =
        catY + "px";

}


// ============================================================
// KEEP CAT INSIDE GAME
// ============================================================

function keepCatInside() {

    const maxX =
        Math.max(
            0,
            game.clientWidth -
            cat.offsetWidth
        );


    const maxY =
        Math.max(
            0,
            game.clientHeight -
            cat.offsetHeight
        );


    catX =
        Math.max(
            0,
            Math.min(
                catX,
                maxX
            )
        );


    catY =
        Math.max(
            0,
            Math.min(
                catY,
                maxY
            )
        );

}


// ============================================================
// RANDOM POSITION
// ============================================================

function randomPosition(
    width,
    height
) {

    const maxX =
        Math.max(
            0,
            game.clientWidth -
            width
        );


    const maxY =
        Math.max(
            0,
            game.clientHeight -
            height
        );


    return {

        x:
            Math.floor(
                Math.random() *
                (maxX + 1)
            ),

        y:
            Math.floor(
                Math.random() *
                (maxY + 1)
            )

    };

}


// ============================================================
// CREATE APPLE
// ============================================================

function createApple() {

    const apple =
        document.createElement(
            "div"
        );


    apple.className =
        "apple";


    apple.textContent =
        "🍎";


    const appleWidth =
        apple.offsetWidth ||
        35;


    const appleHeight =
        apple.offsetHeight ||
        35;


    const position =
        randomPosition(
            appleWidth,
            appleHeight
        );


    apple.style.left =
        position.x + "px";


    apple.style.top =
        position.y + "px";


    game.appendChild(
        apple
    );


    apples.push(
        apple
    );

}


// ============================================================
// CREATE APPLES
// ============================================================

function createApples() {

    // Remove old apples

    apples.forEach(
        apple => {

            if (apple) {

                apple.remove();

            }

        }
    );


    apples = [];


    // ========================================================
    // ROUND 10+
    // APPLES SUDDENLY APPEAR
    // ========================================================

    if (round >= 10) {

        for (
            let i = 0;
            i < appleGoal;
            i++
        ) {

            setTimeout(
                () => {

                    if (
                        gameRunning ||
                        gamePaused
                    ) {

                        createApple();

                    }

                },

                i * 700

            );

        }

    }


        // ========================================================
        // ROUND 1-9
        // ALL APPLES APPEAR
    // ========================================================

    else {

        for (
            let i = 0;
            i < appleGoal;
            i++
        ) {

            createApple();

        }

    }

}


// ============================================================
// CREATE SNAKE
// ============================================================

function createSnake() {

    const snakeElement =
        document.createElement(
            "div"
        );


    snakeElement.className =
        "snake";


    snakeElement.textContent =
        "🐍";


    const snakeWidth =
        35;


    const snakeHeight =
        25;


    // ========================================================
    // IMPORTANT:
    // SNAKE MUST START AWAY FROM CAT
    // ========================================================

    let position;

    let attempts = 0;


    do {

        position =
            randomPosition(
                snakeWidth,
                snakeHeight
            );


        attempts++;


        // Stop after many attempts

        if (attempts > 100) {

            break;

        }


    } while (

        Math.abs(
            position.x - catX
        ) < 250

        ||

        Math.abs(
            position.y - catY
        ) < 180

        );


    snakeElement.style.left =
        position.x + "px";


    snakeElement.style.top =
        position.y + "px";


    game.appendChild(
        snakeElement
    );


    snakes.push({

        element:
        snakeElement,

        x:
        position.x,

        y:
        position.y

    });

}


// ============================================================
// CREATE SNAKES
// ============================================================

function createSnakes(count) {

    // Remove old snakes

    snakes.forEach(
        snake => {

            snake.element.remove();

        }
    );


    snakes = [];


    // ========================================================
    // ROUND 10+
    // SNAKES APPEAR ONE BY ONE
    // ========================================================

    if (round >= 10) {

        for (
            let i = 0;
            i < count;
            i++
        ) {

            setTimeout(
                () => {

                    if (
                        gameRunning ||
                        gamePaused
                    ) {

                        createSnake();

                    }

                },

                i * 1200

            );

        }

    }


        // ========================================================
        // ROUND 1-9
        // SNAKES START TOGETHER
    // ========================================================

    else {

        for (
            let i = 0;
            i < count;
            i++
        ) {

            createSnake();

        }

    }

}


// ============================================================
// COLLISION DETECTION
// ============================================================

function isColliding(
    rect1,
    rect2
) {

    return (

        rect1.left <
        rect2.right

        &&

        rect1.right >
        rect2.left

        &&

        rect1.top <
        rect2.bottom

        &&

        rect1.bottom >
        rect2.top

    );

}


// ============================================================
// CHECK APPLE COLLISION
// ============================================================

function checkAppleCollision() {

    if (!gameRunning)
        return;


    const catRect =
        cat.getBoundingClientRect();


    apples.forEach(
        (apple, index) => {

            if (!apple)
                return;


            const appleRect =
                apple.getBoundingClientRect();


            if (
                isColliding(
                    catRect,
                    appleRect
                )
            ) {

                apple.remove();


                apples[index] =
                    null;


                score++;


                scoreDisplay.textContent =
                    score;


                // WIN ROUND

                if (
                    score >=
                    appleGoal
                ) {

                    completeRound();

                }

            }

        }
    );

}


// ============================================================
// SNAKE SPEED
// ============================================================

function getSnakeSpeed() {

    /*
        Round 1 = very slow.

        Snakes gradually become faster.

        Maximum speed = 2.5.
    */


    return Math.min(

        0.8 +
        ((round - 1) * 0.12),

        2.5

    );

}


// ============================================================
// MOVE SNAKES TOWARD CAT
// ============================================================

function moveSnakes() {

    if (!gameRunning)
        return;


    const snakeSpeed =
        getSnakeSpeed();


    snakes.forEach(
        snake => {

            const catCenterX =
                catX +
                (cat.offsetWidth / 2);


            const catCenterY =
                catY +
                (cat.offsetHeight / 2);


            const snakeCenterX =
                snake.x +
                17;


            const snakeCenterY =
                snake.y +
                12;


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


            if (
                distance > 0
            ) {

                snake.x +=
                    (dx / distance) *
                    snakeSpeed;


                snake.y +=
                    (dy / distance) *
                    snakeSpeed;

            }


            // Keep snake inside game

            snake.x =
                Math.max(
                    0,
                    Math.min(
                        snake.x,
                        game.clientWidth -
                        snake.element.offsetWidth
                    )
                );


            snake.y =
                Math.max(
                    0,
                    Math.min(
                        snake.y,
                        game.clientHeight -
                        snake.element.offsetHeight
                    )
                );


            snake.element.style.left =
                snake.x + "px";


            snake.element.style.top =
                snake.y + "px";

        }
    );

}


// ============================================================
// CHECK SNAKE COLLISION
// ============================================================

function checkSnakeCollision() {

    if (
        !gameRunning ||
        hitCooldown
    ) {

        return;

    }


    const catRect =
        cat.getBoundingClientRect();


    for (
        const snake of snakes
        ) {

        const snakeRect =
            snake.element.getBoundingClientRect();


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


// ============================================================
// LOSE LIFE
// ============================================================

function loseLife() {

    if (hitCooldown)
        return;


    hitCooldown = true;


    lives--;


    livesDisplay.textContent =
        lives;


    // Put cat back to starting area

    catX = 50;

    catY = 50;


    updateCat();


    // Flash cat

    cat.style.opacity =
        "0.3";


    setTimeout(
        () => {

            cat.style.opacity =
                "1";

        },

        300
    );


    // GAME OVER

    if (lives <= 0) {

        gameOver();

        return;

    }


    // Temporary protection

    setTimeout(
        () => {

            hitCooldown =
                false;

        },

        1200
    );

}


// ============================================================
// CAT FIREWORKS
// ============================================================

function startCatFireworks() {

    fireworks.innerHTML =
        "";


    const effects = [

        "🐱",
        "😺",
        "😸",
        "😹",
        "🐈",
        "✨",
        "💥",
        "🎆",
        "🎇",
        "🐾"

    ];


    for (
        let i = 0;
        i < 55;
        i++
    ) {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "catFirework";


        item.textContent =
            effects[
                Math.floor(
                    Math.random() *
                    effects.length
                )
                ];


        item.style.left =
            Math.random() *
            100 +
            "%";


        item.style.top =
            Math.random() *
            100 +
            "%";


        item.style.setProperty(

            "--x",

            (
                Math.random() *
                300 -
                150
            ) +
            "px"

        );


        item.style.setProperty(

            "--y",

            (
                Math.random() *
                300 -
                150
            ) +
            "px"

        );


        fireworks.appendChild(
            item
        );

    }

}


// ============================================================
// COMPLETE ROUND
// ============================================================

function completeRound() {

    gameRunning =
        false;


    gamePaused =
        false;


    stopAllMovement();


    roundTitle.textContent =
        "🎉 ROUND " +
        round +
        " COMPLETE! 🎉";


    roundNote.textContent =
        getRoundNote();


    roundComplete.style.display =
        "flex";


    if (pauseButton) {

        pauseButton.textContent =
            "⏸️ Pause";

    }


    startCatFireworks();

}


// ============================================================
// NEXT ROUND
// ============================================================

nextRoundButton.addEventListener(
    "click",
    function () {

        round++;


        score = 0;


        scoreDisplay.textContent =
            score;


        roundComplete.style.display =
            "none";


        fireworks.innerHTML =
            "";


        gamePaused =
            false;


        gameRunning =
            true;


        if (pauseButton) {

            pauseButton.textContent =
                "⏸️ Pause";

        }


        setupRound();

    }
);


// ============================================================
// START GAME
// ============================================================

startButton.addEventListener(
    "click",
    function () {

        startScreen.style.display =
            "none";


        round = 1;


        score = 0;


        lives =
            STARTING_LIVES;


        gamePaused =
            false;


        gameRunning =
            true;


        scoreDisplay.textContent =
            score;


        livesDisplay.textContent =
            lives;


        catX = 50;

        catY = 50;


        updateCat();


        if (pauseButton) {

            pauseButton.textContent =
                "⏸️ Pause";

        }


        setupRound();

    }
);


// ============================================================
// GAME OVER
// ============================================================

function gameOver() {

    gameRunning =
        false;


    gamePaused =
        false;


    stopAllMovement();


    finalRound.textContent =
        "You reached Round " +
        round +
        "! 🏆";


    gameOverScreen.style.display =
        "flex";


    if (pauseButton) {

        pauseButton.textContent =
            "⏸️ Pause";

    }

}


// ============================================================
// RESTART GAME
// ============================================================

function restartGame() {

    round = 1;

    score = 0;

    lives =
        STARTING_LIVES;


    gameRunning =
        false;


    gamePaused =
        false;


    hitCooldown =
        false;


    scoreDisplay.textContent =
        score;


    livesDisplay.textContent =
        lives;


    roundDisplay.textContent =
        round;


    appleGoal =
        10;


    appleGoalDisplay.textContent =
        appleGoal;


    catX = 50;

    catY = 50;


    updateCat();


    stopAllMovement();


    gameOverScreen.style.display =
        "none";


    roundComplete.style.display =
        "none";


    fireworks.innerHTML =
        "";


    // Remove apples

    apples.forEach(
        apple => {

            if (apple) {

                apple.remove();

            }

        }
    );


    // Remove snakes

    snakes.forEach(
        snake => {

            snake.element.remove();

        }
    );


    apples = [];

    snakes = [];


    startScreen.style.display =
        "flex";


    if (pauseButton) {

        pauseButton.textContent =
            "⏸️ Pause";

    }

}


// ============================================================
// RESTART BUTTONS
// ============================================================

restartButton.addEventListener(
    "click",
    restartGame
);


restartGameButton.addEventListener(
    "click",
    restartGame
);


// ============================================================
// PAUSE / RESUME
// ============================================================

if (pauseButton) {

    pauseButton.addEventListener(
        "click",
        function () {

            // Do nothing before game starts

            if (
                !gameRunning &&
                !gamePaused
            ) {

                return;

            }


            if (gamePaused) {

                // RESUME

                gamePaused =
                    false;

                gameRunning =
                    true;

                pauseButton.textContent =
                    "⏸️ Pause";

            }

            else {

                // PAUSE

                gamePaused =
                    true;

                gameRunning =
                    false;

                stopAllMovement();

                pauseButton.textContent =
                    "▶️ Resume";

            }

        }
    );

}


// ============================================================
// KEYBOARD CONTROLS
// ============================================================

document.addEventListener(
    "keydown",
    function (event) {

        const key =
            event.key.toLowerCase();


        // Prevent page scrolling

        if (

            key === "arrowup" ||

            key === "arrowdown" ||

            key === "arrowleft" ||

            key === "arrowright"

        ) {

            event.preventDefault();

        }


        if (!gameRunning)
            return;


        // UP

        if (
            key === "arrowup" ||
            key === "w"
        ) {

            movement.up =
                true;

        }


        // DOWN

        if (
            key === "arrowdown" ||
            key === "s"
        ) {

            movement.down =
                true;

        }


        // LEFT

        if (
            key === "arrowleft" ||
            key === "a"
        ) {

            movement.left =
                true;

        }


        // RIGHT

        if (
            key === "arrowright" ||
            key === "d"
        ) {

            movement.right =
                true;

        }

    }
);


// ============================================================
// KEYBOARD RELEASE
// ============================================================

document.addEventListener(
    "keyup",
    function (event) {

        const key =
            event.key.toLowerCase();


        if (
            key === "arrowup" ||
            key === "w"
        ) {

            movement.up =
                false;

        }


        if (
            key === "arrowdown" ||
            key === "s"
        ) {

            movement.down =
                false;

        }


        if (
            key === "arrowleft" ||
            key === "a"
        ) {

            movement.left =
                false;

        }


        if (
            key === "arrowright" ||
            key === "d"
        ) {

            movement.right =
                false;

        }

    }
);


// ============================================================
// PHONE MOVEMENT BUTTON
// ============================================================

function setupPhoneButton(
    button,
    direction
) {

    if (!button)
        return;


    function startMove(event) {

        event.preventDefault();


        if (!gameRunning)
            return;


        movement[direction] =
            true;

    }


    function stopMove(event) {

        event.preventDefault();


        movement[direction] =
            false;

    }


    // TOUCH START

    button.addEventListener(
        "touchstart",
        startMove,
        {
            passive: false
        }
    );


    // TOUCH END

    button.addEventListener(
        "touchend",
        stopMove,
        {
            passive: false
        }
    );


    // TOUCH CANCEL

    button.addEventListener(
        "touchcancel",
        stopMove,
        {
            passive: false
        }
    );


    // POINTER SUPPORT

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


    button.addEventListener(
        "pointerleave",
        stopMove
    );

}


// ============================================================
// CONNECT PHONE BUTTONS
// ============================================================

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


// ============================================================
// MOVE CAT
// ============================================================

function moveCat() {

    if (!gameRunning)
        return;


    if (movement.up) {

        catY -=
            CAT_SPEED;

    }


    if (movement.down) {

        catY +=
            CAT_SPEED;

    }


    if (movement.left) {

        catX -=
            CAT_SPEED;

    }


    if (movement.right) {

        catX +=
            CAT_SPEED;

    }


    keepCatInside();


    updateCat();

}


// ============================================================
// STOP ALL MOVEMENT
// ============================================================

function stopAllMovement() {

    movement.up =
        false;

    movement.down =
        false;

    movement.left =
        false;

    movement.right =
        false;

}


// ============================================================
// GAME LOOP
// ============================================================

function gameLoop() {

    if (gameRunning) {

        moveCat();

        moveSnakes();

        checkAppleCollision();

        checkSnakeCollision();

    }


    requestAnimationFrame(
        gameLoop
    );

}


// ============================================================
// INITIAL STATE
// ============================================================

updateCat();


scoreDisplay.textContent =
    "0";


livesDisplay.textContent =
    STARTING_LIVES;


roundDisplay.textContent =
    "1";


appleGoalDisplay.textContent =
    "10";


if (pauseButton) {

    pauseButton.textContent =
        "⏸️ Pause";

}


// ============================================================
// START GAME LOOP
// ============================================================

gameLoop();