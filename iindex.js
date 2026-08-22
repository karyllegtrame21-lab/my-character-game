// ============================================================
// MEOWPLE RUSH
// COMPLETE GAME JAVASCRIPT
// ============================================================


// ============================================================
// HTML ELEMENTS
// ============================================================

const game =
    document.getElementById("game");

const cat =
    document.getElementById("cat");

const scoreDisplay =
    document.getElementById("score");

const livesDisplay =
    document.getElementById("lives");

const appleGoalDisplay =
    document.getElementById("appleGoal");

const roundDisplay =
    document.getElementById("round");


const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");


const roundComplete =
    document.getElementById("roundComplete");

const roundTitle =
    document.getElementById("roundTitle");

const roundNote =
    document.getElementById("roundNote");

const nextRoundButton =
    document.getElementById("nextRoundButton");


const gameOverScreen =
    document.getElementById("gameOverScreen");

const gameOverNote =
    document.getElementById("gameOverNote");

const finalRound =
    document.getElementById("finalRound");

const restartButton =
    document.getElementById("restart");

const restartGameButton =
    document.getElementById(
        "restartGameButton"
    );


const pauseButton =
    document.getElementById(
        "pauseButton"
    );


const fireworks =
    document.getElementById(
        "fireworks"
    );


// ============================================================
// PHONE CONTROLS
// ============================================================

const upButton =
    document.getElementById("up");

const downButton =
    document.getElementById("down");

const leftButton =
    document.getElementById("left");

const rightButton =
    document.getElementById("right");


// ============================================================
// SETTINGS
// ============================================================

const STARTING_LIVES = 5;


// Round 1 is deliberately slower.

const CAT_SPEED = 6.5;


// ============================================================
// GAME VARIABLES
// ============================================================

let round = 1;

let score = 0;

let lives =
    STARTING_LIVES;

let appleGoal = 10;

let gameRunning = false;

let gamePaused = false;

let hitCooldown = false;


let catX = 50;

let catY = 50;


let apples = [];

let snakes = [];


// Used to cancel delayed
// Round 10+ spawning.

let spawnTimers = [];


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
// ROUND NOTES
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
        "IMMORTAL YARN 😭🔥"

};


// ============================================================
// GET ROUND NOTE
// ============================================================

function getRoundNote() {

    if (roundNotes[round]) {

        return roundNotes[round];

    }


    if (
        round % 5 === 0
    ) {

        return (
            "INYAKITDENN! " +
            "Umabot ka pa rin?! 😂🔥"
        );

    }


    if (
        round % 2 === 0
    ) {

        return (
            "Grabe ka, " +
            "ayaw mo talagang sumuko! 😂"
        );

    }


    return (
        "Round " +
        round +
        " pa lang? " +
        "Tuloy mo lang! 😈🐱"
    );

}


// ============================================================
// CLEAR SPAWN TIMERS
// ============================================================

function clearSpawnTimers() {

    spawnTimers.forEach(
        timer => {

            clearTimeout(timer);

        }
    );


    spawnTimers = [];

}


// ============================================================
// REMOVE ALL APPLES
// ============================================================

function removeAllApples() {

    apples.forEach(
        apple => {

            if (apple) {

                apple.remove();

            }

        }
    );


    apples = [];

}


// ============================================================
// REMOVE ALL SNAKES
// ============================================================

function removeAllSnakes() {

    snakes.forEach(
        snake => {

            if (
                snake &&
                snake.element
            ) {

                snake.element.remove();

            }

        }
    );


    snakes = [];

}


// ============================================================
// SETUP ROUND
// ============================================================

function setupRound() {

    // --------------------------------------------------------
    // More apples every round.
    // --------------------------------------------------------

    appleGoal =
        10 +
        (
            (round - 1) * 2
        );


    appleGoalDisplay.textContent =
        appleGoal;


    roundDisplay.textContent =
        round;


    // --------------------------------------------------------
    // IMPORTANT:
    // Every new round starts with 5 lives.
    // --------------------------------------------------------

    lives =
        STARTING_LIVES;


    livesDisplay.textContent =
        lives;


    hitCooldown = false;


    // --------------------------------------------------------
    // Reset cat.
    // --------------------------------------------------------

    catX = 50;

    catY = 50;

    updateCat();


    // --------------------------------------------------------
    // Remove old objects.
    // --------------------------------------------------------

    clearSpawnTimers();

    removeAllApples();

    removeAllSnakes();


    // --------------------------------------------------------
    // Number of snakes increases gradually.
    // --------------------------------------------------------

    const snakeCount =
        Math.min(
            2 +
            Math.floor(
                (round - 1) / 2
            ),
            8
        );


    // --------------------------------------------------------
    // Spawn apples.
    // --------------------------------------------------------

    createApples();


    // --------------------------------------------------------
    // Spawn snakes.
    // --------------------------------------------------------

    createSnakes(
        snakeCount
    );

}


// ============================================================
// UPDATE CAT
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
// SAFE POSITION AWAY FROM CAT
// ============================================================

function getSafePosition(
    width,
    height
) {

    let position;

    let attempts = 0;


    do {

        position =
            randomPosition(
                width,
                height
            );


        attempts++;


        const distanceX =
            Math.abs(
                position.x -
                catX
            );


        const distanceY =
            Math.abs(
                position.y -
                catY
            );


        /*
            Keep the snake away from the cat.

            This is especially important
            when a new round begins.
        */

        if (
            distanceX > 220 ||
            distanceY > 160
        ) {

            return position;

        }


    } while (
        attempts < 100
        );


    // Fallback:
    // use the opposite corner.

    const oppositeX =
        game.clientWidth -
        width -
        25;


    const oppositeY =
        game.clientHeight -
        height -
        25;


    return {

        x:
            Math.max(
                0,
                oppositeX
            ),

        y:
            Math.max(
                0,
                oppositeY
            )

    };

}


// ============================================================
// CREATE APPLE
// ============================================================

function createApple() {

    if (!game)
        return;


    const apple =
        document.createElement(
            "div"
        );


    apple.className =
        "apple";


    apple.textContent =
        "🍎";


    const position =
        randomPosition(
            38,
            38
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

    removeAllApples();


    // --------------------------------------------------------
    // Rounds 1-9:
    // Apples appear normally.
    // --------------------------------------------------------

    if (
        round < 10
    ) {

        for (
            let i = 0;
            i < appleGoal;
            i++
        ) {

            createApple();

        }

        return;

    }


    // --------------------------------------------------------
    // Round 10+:
    // Apples suddenly appear one by one.
    // --------------------------------------------------------

    for (
        let i = 0;
        i < appleGoal;
        i++
    ) {

        const timer =
            setTimeout(
                () => {

                    if (
                        gameRunning ||
                        gamePaused
                    ) {

                        createApple();

                    }

                },

                i * 650
            );


        spawnTimers.push(
            timer
        );

    }

}


// ============================================================
// CREATE SNAKE
// ============================================================

function createSnake() {

    if (!game)
        return;


    const snakeElement =
        document.createElement(
            "div"
        );


    snakeElement.className =
        "snake";


    snakeElement.textContent =
        "🐍";


    // --------------------------------------------------------
    // ALWAYS use safe position.
    // --------------------------------------------------------

    const position =
        getSafePosition(
            40,
            30
        );


    const snake = {

        element:
        snakeElement,

        x:
        position.x,

        y:
        position.y

    };


    snakeElement.style.left =
        snake.x + "px";


    snakeElement.style.top =
        snake.y + "px";


    game.appendChild(
        snakeElement
    );


    snakes.push(
        snake
    );

}


// ============================================================
// CREATE SNAKES
// ============================================================

function createSnakes(
    count
) {

    removeAllSnakes();


    // --------------------------------------------------------
    // Rounds 1-9:
    // All snakes appear at the beginning.
    // --------------------------------------------------------

    if (
        round < 10
    ) {

        for (
            let i = 0;
            i < count;
            i++
        ) {

            createSnake();

        }

        return;

    }


    // --------------------------------------------------------
    // Round 10+:
    // Snakes suddenly appear gradually.
    // --------------------------------------------------------

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const timer =
            setTimeout(
                () => {

                    if (
                        gameRunning ||
                        gamePaused
                    ) {

                        createSnake();

                    }

                },

                i * 1100
            );


        spawnTimers.push(
            timer
        );

    }

}


// ============================================================
// COLLISION
// ============================================================

function isColliding(
    rect1,
    rect2
) {

    return (

        rect1.left <
        rect2.right &&

        rect1.right >
        rect2.left &&

        rect1.top <
        rect2.bottom &&

        rect1.bottom >
        rect2.top

    );

}


// ============================================================
// CHECK APPLES
// ============================================================

function checkAppleCollision() {

    if (!gameRunning)
        return;


    const catRect =
        cat.getBoundingClientRect();


    for (
        let i = apples.length - 1;
        i >= 0;
        i--
    ) {

        const apple =
            apples[i];


        if (!apple)
            continue;


        const appleRect =
            apple.getBoundingClientRect();


        if (
            isColliding(
                catRect,
                appleRect
            )
        ) {

            apple.remove();


            apples.splice(
                i,
                1
            );


            score++;


            scoreDisplay.textContent =
                score;


            if (
                score >=
                appleGoal
            ) {

                completeRound();

                return;

            }

        }

    }

}


// ============================================================
// SNAKE SPEED
// ============================================================

function getSnakeSpeed() {

    /*
        Round 1 starts slow.

        Difficulty increases gradually.

        Maximum speed is 2.5.
    */

    return Math.min(

        0.65 +
        (
            (round - 1) *
            0.12
        ),

        2.5

    );

}


// ============================================================
// MOVE SNAKES
// ============================================================

function moveSnakes() {

    if (!gameRunning)
        return;


    const speed =
        getSnakeSpeed();


    snakes.forEach(
        snake => {

            const catCenterX =
                catX +
                (
                    cat.offsetWidth /
                    2
                );


            const catCenterY =
                catY +
                (
                    cat.offsetHeight /
                    2
                );


            const snakeCenterX =
                snake.x +
                20;


            const snakeCenterY =
                snake.y +
                15;


            const dx =
                catCenterX -
                snakeCenterX;


            const dy =
                catCenterY -
                snakeCenterY;


            const distance =
                Math.sqrt(
                    (
                        dx * dx
                    ) +
                    (
                        dy * dy
                    )
                );


            if (
                distance > 0
            ) {

                snake.x +=
                    (
                        dx /
                        distance
                    ) *
                    speed;


                snake.y +=
                    (
                        dy /
                        distance
                    ) *
                    speed;

            }


            // Keep snake inside game.

            const maxX =
                game.clientWidth -
                snake.element.offsetWidth;


            const maxY =
                game.clientHeight -
                snake.element.offsetHeight;


            snake.x =
                Math.max(
                    0,
                    Math.min(
                        snake.x,
                        maxX
                    )
                );


            snake.y =
                Math.max(
                    0,
                    Math.min(
                        snake.y,
                        maxY
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
            snake.element
                .getBoundingClientRect();


        if (
            isColliding(
                catRect,
                snakeRect
            )
        ) {

            loseLife(
                snake
            );

            return;

        }

    }

}


// ============================================================
// LOSE LIFE
// ============================================================

function loseLife(
    hitSnake
) {

    if (hitCooldown)
        return;


    hitCooldown = true;


    lives--;


    livesDisplay.textContent =
        lives;


    // --------------------------------------------------------
    // Put cat back to starting corner.
    // --------------------------------------------------------

    catX = 45;

    catY = 45;

    updateCat();


    // --------------------------------------------------------
    // Respawn the snake AWAY from the cat.
    // --------------------------------------------------------

    if (
        hitSnake &&
        hitSnake.element
    ) {

        const newPosition =
            getSafePosition(
                40,
                30
            );


        hitSnake.x =
            newPosition.x;


        hitSnake.y =
            newPosition.y;


        hitSnake.element.style.left =
            hitSnake.x +
            "px";


        hitSnake.element.style.top =
            hitSnake.y +
            "px";

    }


    // --------------------------------------------------------
    // Cat visual damage effect.
    // --------------------------------------------------------

    cat.style.transform =
        "scale(1.2)";


    cat.style.opacity =
        "0.45";


    setTimeout(
        () => {

            cat.style.transform =
                "scale(1)";

            cat.style.opacity =
                "1";

        },

        350
    );


    // --------------------------------------------------------
    // GAME OVER
    // --------------------------------------------------------

    if (
        lives <= 0
    ) {

        gameOver();

        return;

    }


    // Temporary invincibility.

    setTimeout(
        () => {

            hitCooldown =
                false;

        },

        1100
    );

}


// ============================================================
// FIREWORKS
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
        "🐾",
        "✨",
        "💥",
        "🎆",
        "🎇"

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
            (
                Math.random() *
                100
            ) +
            "%";


        item.style.top =
            (
                Math.random() *
                100
            ) +
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


    clearSpawnTimers();


    roundTitle.textContent =
        "🎉 ROUND " +
        round +
        " COMPLETE! 🎉";


    roundNote.textContent =
        getRoundNote();


    roundComplete.style.display =
        "flex";


    pauseButton.textContent =
        "⏸️ Pause";


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


        pauseButton.textContent =
            "⏸️ Pause";


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


        roundComplete.style.display =
            "none";


        gameOverScreen.style.display =
            "none";


        round = 1;

        score = 0;

        lives =
            STARTING_LIVES;


        gameRunning =
            true;


        gamePaused =
            false;


        scoreDisplay.textContent =
            score;


        livesDisplay.textContent =
            lives;


        roundDisplay.textContent =
            round;


        catX = 45;

        catY = 45;


        updateCat();


        pauseButton.textContent =
            "⏸️ Pause";


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


    clearSpawnTimers();


    gameOverNote.textContent =
        "PUYOT! 😂";


    finalRound.textContent =
        "You reached Round " +
        round +
        "! 🏆";


    gameOverScreen.style.display =
        "flex";


    pauseButton.textContent =
        "⏸️ Pause";

}


// ============================================================
// RESTART
// ============================================================

function restartGame() {

    clearSpawnTimers();


    gameRunning =
        false;


    gamePaused =
        false;


    stopAllMovement();


    removeAllApples();

    removeAllSnakes();


    round = 1;

    score = 0;

    lives =
        STARTING_LIVES;

    appleGoal = 10;


    catX = 45;

    catY = 45;


    scoreDisplay.textContent =
        "0";


    livesDisplay.textContent =
        "5";


    appleGoalDisplay.textContent =
        "10";


    roundDisplay.textContent =
        "1";


    updateCat();


    roundComplete.style.display =
        "none";


    gameOverScreen.style.display =
        "none";


    fireworks.innerHTML =
        "";


    pauseButton.textContent =
        "⏸️ Pause";


    startScreen.style.display =
        "flex";

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

pauseButton.addEventListener(
    "click",
    function () {

        // Cannot pause before starting.

        if (
            !gameRunning &&
            !gamePaused
        ) {

            return;

        }


        if (
            gamePaused
        ) {

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


// ============================================================
// KEYBOARD DOWN
// ============================================================

document.addEventListener(
    "keydown",
    function (event) {

        const key =
            event.key.toLowerCase();


        // Prevent arrow-key page scrolling.

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


        if (
            key === "arrowup" ||
            key === "w"
        ) {

            movement.up =
                true;

        }


        if (
            key === "arrowdown" ||
            key === "s"
        ) {

            movement.down =
                true;

        }


        if (
            key === "arrowleft" ||
            key === "a"
        ) {

            movement.left =
                true;

        }


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
// KEYBOARD UP
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
// PHONE BUTTON
// ============================================================

function setupPhoneButton(
    button,
    direction
) {

    if (!button)
        return;


    function startMove(
        event
    ) {

        event.preventDefault();


        if (!gameRunning)
            return;


        movement[direction] =
            true;

    }


    function stopMove(
        event
    ) {

        event.preventDefault();


        movement[direction] =
            false;

    }


    button.addEventListener(
        "touchstart",
        startMove,
        {
            passive: false
        }
    );


    button.addEventListener(
        "touchend",
        stopMove,
        {
            passive: false
        }
    );


    button.addEventListener(
        "touchcancel",
        stopMove,
        {
            passive: false
        }
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


    button.addEventListener(
        "pointerleave",
        stopMove
    );

}


// ============================================================
// CONNECT PHONE CONTROLS
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
// STOP MOVEMENT
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


appleGoalDisplay.textContent =
    "10";


roundDisplay.textContent =
    "1";


pauseButton.textContent =
    "⏸️ Pause";


// ============================================================
// START LOOP
// ============================================================

gameLoop();