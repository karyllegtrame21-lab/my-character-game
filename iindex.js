/* =========================================================
   MEOWPLE RUSH
   COMPLETE GAME JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const game = document.getElementById("game");
const cat = document.getElementById("cat");

const scoreDisplay = document.getElementById("score");
const appleGoalDisplay = document.getElementById("appleGoal");
const livesDisplay = document.getElementById("lives");
const roundDisplay = document.getElementById("round");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const roundComplete = document.getElementById("roundComplete");
const roundTitle = document.getElementById("roundTitle");
const roundNote = document.getElementById("roundNote");
const nextRoundButton = document.getElementById("nextRoundButton");

const gameOverScreen = document.getElementById("gameOverScreen");
const gameOverNote = document.getElementById("gameOverNote");
const finalRound = document.getElementById("finalRound");
const restartGameButton = document.getElementById("restartGameButton");

const restartButton = document.getElementById("restart");
const pauseButton = document.getElementById("pauseButton");
const pauseMessage = document.getElementById("pauseMessage");

const fireworks = document.getElementById("fireworks");

const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");


/* =========================================================
   GAME VARIABLES
========================================================= */

let gameRunning = false;
let gamePaused = false;

let round = 1;

let score = 0;
let lives = 5;

let appleGoal = 10;

let catX = 0;
let catY = 0;

const CAT_SPEED = 4.5;


/* =========================================================
   MOVEMENT
========================================================= */

const movement = {
    up: false,
    down: false,
    left: false,
    right: false
};


/* =========================================================
   OBJECT ARRAYS
========================================================= */

let apples = [];
let snakes = [];


/* =========================================================
   TIMERS
========================================================= */

let animationFrame = null;
let appleSpawnTimer = null;
let snakeSpawnTimer = null;


/* =========================================================
   ROUND SETTINGS
========================================================= */

function getRoundSettings() {

    /*
        Every round adds more apples.

        Round 1 = 10 apples
        Round 2 = 11 apples
        Round 3 = 12 apples
        etc.
    */

    const applesNeeded = 10 + (round - 1);

    /*
        Snakes increase gradually.
    */

    const snakeCount = Math.min(
        2 + Math.floor((round - 1) / 2),
        12
    );

    /*
        Snakes are intentionally slow.
    */

    const snakeSpeed =
        Math.min(
            0.75 + (round - 1) * 0.045,
            1.35
        );

    /*
        Round 10 becomes special.
        Apples and snakes can suddenly appear.
    */

    const surpriseSpawn = round >= 10;

    return {
        applesNeeded,
        snakeCount,
        snakeSpeed,
        surpriseSpawn
    };
}


/* =========================================================
   UI
========================================================= */

function updateUI() {

    scoreDisplay.textContent = score;
    appleGoalDisplay.textContent = appleGoal;
    livesDisplay.textContent = lives;
    roundDisplay.textContent = round;
}


/* =========================================================
   GAME BOUNDS
========================================================= */

function getGameWidth() {
    return game.clientWidth;
}

function getGameHeight() {
    return game.clientHeight;
}


/* =========================================================
   CAT POSITION
========================================================= */

function placeCat() {

    const maxX = getGameWidth() - 60;
    const maxY = getGameHeight() - 60;

    catX = Math.max(0, Math.min(catX, maxX));
    catY = Math.max(0, Math.min(catY, maxY));

    cat.style.left = catX + "px";
    cat.style.top = catY + "px";
}


/* =========================================================
   RESET CAT
========================================================= */

function resetCat() {

    /*
        Start near the bottom-left,
        rather than spawning in the middle.
    */

    catX = 70;
    catY = getGameHeight() - 100;

    placeCat();
}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    round = 1;

    score = 0;
    lives = 5;

    gameRunning = true;
    gamePaused = false;

    startScreen.style.display = "none";
    roundComplete.style.display = "none";
    gameOverScreen.style.display = "none";

    pauseMessage.style.display = "none";

    pauseButton.textContent = "⏸️ Pause";

    clearObjects();

    setupRound();

    startMovementLoop();
}


/* =========================================================
   SETUP ROUND
========================================================= */

function setupRound() {

    clearObjects();

    const settings = getRoundSettings();

    appleGoal = settings.applesNeeded;

    /*
        IMPORTANT:
        Every new round restores 5 lives.
    */

    lives = 5;
    score = 0;

    updateUI();

    resetCat();

    /*
        Spawn apples.
    */

    spawnInitialApples();

    /*
        Spawn snakes in opposite corners.
    */

    spawnInitialSnakes();

    /*
        Later rounds may spawn additional
        objects during gameplay.
    */

    setupDynamicSpawning();
}


/* =========================================================
   CLEAR OBJECTS
========================================================= */

function clearObjects() {

    apples.forEach(apple => {
        if (apple.element) {
            apple.element.remove();
        }
    });

    snakes.forEach(snake => {
        if (snake.element) {
            snake.element.remove();
        }
    });

    apples = [];
    snakes = [];

    clearTimeout(appleSpawnTimer);
    clearTimeout(snakeSpawnTimer);
}


/* =========================================================
   RANDOM POSITION
========================================================= */

function randomPosition(width, height) {

    const padding = 20;

    const maxX =
        Math.max(
            padding,
            getGameWidth() - width - padding
        );

    const maxY =
        Math.max(
            padding,
            getGameHeight() - height - padding
        );

    return {
        x: padding + Math.random() * (maxX - padding),
        y: padding + Math.random() * (maxY - padding)
    };
}


/* =========================================================
   DISTANCE
========================================================= */

function distance(x1, y1, x2, y2) {

    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
}


/* =========================================================
   CHECK SAFE SPAWN
========================================================= */

function isSafeFromCat(x, y, size = 40) {

    const centerX = x + size / 2;
    const centerY = y + size / 2;

    const catCenterX = catX + 30;
    const catCenterY = catY + 30;

    return distance(
        centerX,
        centerY,
        catCenterX,
        catCenterY
    ) > 180;
}


/* =========================================================
   SPAWN APPLE
========================================================= */

function spawnApple(hiddenInitially = false) {

    if (score >= appleGoal) {
        return;
    }

    const element = document.createElement("div");

    element.className = "apple";
    element.textContent = "🍎";

    let position;
    let attempts = 0;

    do {

        position = randomPosition(38, 38);
        attempts++;

    } while (
        !isSafeFromCat(position.x, position.y, 38)
        && attempts < 50
        );

    element.style.left = position.x + "px";
    element.style.top = position.y + "px";

    if (hiddenInitially) {

        element.style.opacity = "0";
        element.style.transform = "scale(.1)";

        /*
            Suddenly appear later.
        */

        const delay =
            700 + Math.random() * 2500;

        setTimeout(() => {

            if (element.parentElement) {

                element.style.transition =
                    "opacity .2s ease, transform .2s ease";

                element.style.opacity = "1";
                element.style.transform = "scale(1)";
            }

        }, delay);
    }

    game.appendChild(element);

    const apple = {
        element,
        x: position.x,
        y: position.y,
        visible: !hiddenInitially
    };

    apples.push(apple);
}


/* =========================================================
   INITIAL APPLES
========================================================= */

function spawnInitialApples() {

    const settings = getRoundSettings();

    /*
        Keep a reasonable number visible.
    */

    const initialCount =
        Math.min(
            settings.applesNeeded,
            7 + Math.floor(round / 3)
        );

    for (let i = 0; i < initialCount; i++) {

        spawnApple(settings.surpriseSpawn);
    }
}


/* =========================================================
   DYNAMIC APPLE SPAWN
========================================================= */

function setupDynamicSpawning() {

    clearTimeout(appleSpawnTimer);

    function spawnMoreApple() {

        if (!gameRunning) {
            return;
        }

        if (gamePaused) {

            appleSpawnTimer =
                setTimeout(spawnMoreApple, 500);

            return;
        }

        if (
            score < appleGoal &&
            apples.length < 7
        ) {

            spawnApple(round >= 10);
        }

        appleSpawnTimer =
            setTimeout(
                spawnMoreApple,
                Math.max(700, 2200 - round * 40)
            );
    }

    appleSpawnTimer =
        setTimeout(spawnMoreApple, 1200);
}


/* =========================================================
   SPAWN SNAKE
========================================================= */

function spawnSnake(hiddenInitially = false) {

    const element = document.createElement("div");

    element.className = "snake";
    element.textContent = "🐍";

    /*
        IMPORTANT:
        Snakes spawn in the opposite corners
        instead of directly beside the cat.
    */

    const corners = [

        {
            x: 20,
            y: 20
        },

        {
            x: getGameWidth() - 65,
            y: 20
        },

        {
            x: 20,
            y: getGameHeight() - 55
        },

        {
            x: getGameWidth() - 65,
            y: getGameHeight() - 55
        }

    ];

    /*
        Pick a corner that is far from cat.
    */

    let validCorners =
        corners.filter(corner =>
            isSafeFromCat(
                corner.x,
                corner.y,
                42
            )
        );

    if (validCorners.length === 0) {
        validCorners = corners;
    }

    const corner =
        validCorners[
            Math.floor(
                Math.random() * validCorners.length
            )
            ];

    let snakeX = corner.x;
    let snakeY = corner.y;

    element.style.left = snakeX + "px";
    element.style.top = snakeY + "px";

    if (hiddenInitially) {

        element.style.opacity = "0";
        element.style.transform = "scale(.1)";

        /*
            Surprise appearance.
        */

        const delay =
            500 + Math.random() * 3000;

        setTimeout(() => {

            if (element.parentElement) {

                element.style.transition =
                    "opacity .2s ease, transform .2s ease";

                element.style.opacity = "1";
                element.style.transform = "scale(1)";
            }

        }, delay);
    }

    game.appendChild(element);

    const settings = getRoundSettings();

    snakes.push({

        element,

        x: snakeX,
        y: snakeY,

        speed: settings.snakeSpeed,

        wiggle: Math.random() * Math.PI * 2,

        visible: !hiddenInitially
    });
}


/* =========================================================
   INITIAL SNAKES
========================================================= */

function spawnInitialSnakes() {

    const settings = getRoundSettings();

    for (
        let i = 0;
        i < settings.snakeCount;
        i++
    ) {

        /*
            Round 10+ gets surprise spawning.
        */

        spawnSnake(settings.surpriseSpawn);
    }
}


/* =========================================================
   DYNAMIC SNAKE SPAWN
========================================================= */

function setupDynamicSnakeSpawning() {

    clearTimeout(snakeSpawnTimer);

    function spawnMoreSnake() {

        if (!gameRunning) {
            return;
        }

        if (gamePaused) {

            snakeSpawnTimer =
                setTimeout(spawnMoreSnake, 600);

            return;
        }

        const settings = getRoundSettings();

        if (
            snakes.length <
            settings.snakeCount
        ) {

            spawnSnake(round >= 10);
        }

        snakeSpawnTimer =
            setTimeout(
                spawnMoreSnake,
                Math.max(
                    1200,
                    3500 - round * 80
                )
            );
    }

    snakeSpawnTimer =
        setTimeout(spawnMoreSnake, 1800);
}


/* =========================================================
   OVERRIDE ROUND SPAWNING
========================================================= */

function setupDynamicSpawning() {

    clearTimeout(appleSpawnTimer);
    clearTimeout(snakeSpawnTimer);

    /*
        APPLE SPAWNING
    */

    function appleLoop() {

        if (!gameRunning) {
            return;
        }

        if (!gamePaused) {

            if (
                score < appleGoal &&
                apples.length < 7
            ) {

                spawnApple(round >= 10);
            }
        }

        appleSpawnTimer =
            setTimeout(
                appleLoop,
                Math.max(
                    700,
                    2200 - round * 40
                )
            );
    }


    /*
        SNAKE SPAWNING
    */

    function snakeLoop() {

        if (!gameRunning) {
            return;
        }

        if (!gamePaused) {

            const settings =
                getRoundSettings();

            if (
                snakes.length <
                settings.snakeCount
            ) {

                spawnSnake(round >= 10);
            }
        }

        snakeSpawnTimer =
            setTimeout(
                snakeLoop,
                Math.max(
                    1400,
                    3500 - round * 70
                )
            );
    }


    appleSpawnTimer =
        setTimeout(appleLoop, 1200);

    snakeSpawnTimer =
        setTimeout(snakeLoop, 2000);
}


/* =========================================================
   MOVE CAT
========================================================= */

function moveCat() {

    if (!gameRunning || gamePaused) {
        return;
    }

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

    placeCat();
}


/* =========================================================
   MOVE SNAKES
========================================================= */

function moveSnakes() {

    if (!gameRunning || gamePaused) {
        return;
    }

    snakes.forEach((snake, index) => {

        /*
            Direction toward cat.
        */

        const targetX =
            catX + 30;

        const targetY =
            catY + 30;

        const snakeCenterX =
            snake.x + 21;

        const snakeCenterY =
            snake.y + 16;

        const dx =
            targetX - snakeCenterX;

        const dy =
            targetY - snakeCenterY;

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (length > 0) {

            /*
                Slow crawling behavior.
            */

            const directionX =
                dx / length;

            const directionY =
                dy / length;

            snake.x +=
                directionX *
                snake.speed;

            snake.y +=
                directionY *
                snake.speed;

            /*
                Snake-like side-to-side movement.
            */

            snake.wiggle += 0.08;

            const wiggle =
                Math.sin(
                    snake.wiggle
                ) * 3;

            snake.element.style.left =
                (snake.x + wiggle) + "px";

            snake.element.style.top =
                snake.y + "px";

            /*
                Flip snake depending
                on direction.
            */

            if (dx < 0) {

                snake.element.style.transform =
                    "scaleX(-1)";

            } else {

                snake.element.style.transform =
                    "scaleX(1)";
            }
        }

        /*
            Collision with cat.
        */

        if (
            checkCollision(
                catX,
                catY,
                60,
                60,
                snake.x,
                snake.y,
                42,
                32
            )
        ) {

            hitSnake(index);
        }

    });
}


/* =========================================================
   COLLISION
========================================================= */

function checkCollision(
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


/* =========================================================
   HIT SNAKE
========================================================= */

function hitSnake(index) {

    if (!gameRunning || gamePaused) {
        return;
    }

    const snake =
        snakes[index];

    if (!snake) {
        return;
    }

    /*
        Remove snake temporarily.
    */

    snake.element.remove();

    snakes.splice(index, 1);

    lives--;

    updateUI();

    /*
        Push cat away from danger.
    */

    catX =
        Math.max(
            10,
            Math.min(
                getGameWidth() - 70,
                catX + (Math.random() > .5 ? 60 : -60)
            )
        );

    catY =
        Math.max(
            10,
            Math.min(
                getGameHeight() - 70,
                catY + (Math.random() > .5 ? 60 : -60)
            )
        );

    placeCat();

    /*
        GAME OVER
    */

    if (lives <= 0) {

        endGame();
    }
}


/* =========================================================
   COLLECT APPLES
========================================================= */

function checkAppleCollection() {

    if (!gameRunning || gamePaused) {
        return;
    }

    for (
        let i = apples.length - 1;
        i >= 0;
        i--
    ) {

        const apple =
            apples[i];

        if (
            checkCollision(
                catX,
                catY,
                60,
                60,
                apple.x,
                apple.y,
                38,
                38
            )
        ) {

            apple.element.remove();

            apples.splice(i, 1);

            score++;

            updateUI();

            /*
                WIN ROUND
            */

            if (score >= appleGoal) {

                completeRound();

                return;
            }
        }
    }
}


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop() {

    if (gameRunning) {

        moveCat();

        moveSnakes();

        checkAppleCollection();
    }

    animationFrame =
        requestAnimationFrame(gameLoop);
}


/* =========================================================
   START MOVEMENT LOOP
========================================================= */

function startMovementLoop() {

    if (!animationFrame) {
        animationFrame =
            requestAnimationFrame(gameLoop);
    }
}


/* =========================================================
   KEYBOARD MOVEMENT
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();

        /*
            Prevent browser scrolling
            when using arrows.
        */

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


        if (key === "arrowup" || key === "w") {
            movement.up = true;
        }

        if (key === "arrowdown" || key === "s") {
            movement.down = true;
        }

        if (key === "arrowleft" || key === "a") {
            movement.left = true;
        }

        if (key === "arrowright" || key === "d") {
            movement.right = true;
        }


        /*
            SPACE = PAUSE
        */

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

        if (key === "arrowup" || key === "w") {
            movement.up = false;
        }

        if (key === "arrowdown" || key === "s") {
            movement.down = false;
        }

        if (key === "arrowleft" || key === "a") {
            movement.left = false;
        }

        if (key === "arrowright" || key === "d") {
            movement.right = false;
        }
    }
);


/* =========================================================
   PHONE BUTTONS
========================================================= */

function setupPhoneButton(
    button,
    direction
) {

    if (!button) {
        return;
    }


    /*
        Touch start
    */

    button.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            movement[direction] = true;

            /*
                Keep button active
                while finger is held.
            */

            try {
                button.setPointerCapture(
                    event.pointerId
                );
            } catch (error) {
                // Ignore unsupported pointer capture.
            }
        }
    );


    /*
        Touch release
    */

    button.addEventListener(
        "pointerup",
        function(event) {

            event.preventDefault();

            movement[direction] = false;
        }
    );


    button.addEventListener(
        "pointercancel",
        function() {

            movement[direction] = false;
        }
    );


    button.addEventListener(
        "pointerleave",
        function() {

            movement[direction] = false;
        }
    );


    /*
        Extra safety.
    */

    button.addEventListener(
        "touchstart",
        function(event) {

            event.preventDefault();

            movement[direction] = true;
        },
        {
            passive: false
        }
    );


    button.addEventListener(
        "touchend",
        function(event) {

            event.preventDefault();

            movement[direction] = false;
        },
        {
            passive: false
        }
    );
}


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


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

    if (!gameRunning) {
        return;
    }

    gamePaused =
        !gamePaused;

    if (gamePaused) {

        pauseMessage.style.display =
            "block";

        pauseButton.textContent =
            "▶️ Resume";

        /*
            Stop movement inputs.
        */

        movement.up = false;
        movement.down = false;
        movement.left = false;
        movement.right = false;

    } else {

        pauseMessage.style.display =
            "none";

        pauseButton.textContent =
            "⏸️ Pause";
    }
}


/* =========================================================
   COMPLETE ROUND
========================================================= */

function completeRound() {

    if (!gameRunning) {
        return;
    }

    gameRunning = false;
    gamePaused = false;

    clearTimeout(appleSpawnTimer);
    clearTimeout(snakeSpawnTimer);

    movement.up = false;
    movement.down = false;
    movement.left = false;
    movement.right = false;

    /*
        Remove remaining objects.
    */

    clearObjects();

    /*
        Show round note.
    */

    roundNote.textContent =
        getRoundNote(round);

    roundTitle.textContent =
        "🎉 ROUND " +
        round +
        " COMPLETE! 🎉";

    roundComplete.style.display =
        "flex";

    /*
        Fireworks!
    */

    createCatFireworks();
}


/* =========================================================
   ROUND NOTES
========================================================= */

function getRoundNote(currentRound) {

    if (currentRound === 1) {

        return "Kaya mo naman pala eh, pero bakit sa akin hirap na hirap ka, emee!!! 😂🐱";

    }

    if (currentRound === 5) {

        return "INYAKITDENN! 😂🔥";

    }

    if (currentRound === 10) {

        return "IMMORTAL YARN 😭🐱🔥";

    }

    /*
        Special notes for some later rounds.
    */

    const notes = [

        "Ay wow! Hindi ka pa rin sumusuko? 😂",

        "Meow! Parang seryoso ka na ah. 🐱",

        "Hala, lumalakas ka na! 😭",

        "The cat is getting dangerous. 🐱🔥",

        "Another round?! Grabe ka! 😂",

        "Sige lang, tingnan natin kung hanggang saan ka. 👀",

        "The snakes are getting nervous. 🐍",

        "Hindi pa tapos ang kalokohan! 😂",

        "Meowple says: TRY AGAIN! 🐱",

        "Okay... you're actually good at this. 😭"

    ];

    return notes[
    (currentRound - 2) %
    notes.length
        ];
}


/* =========================================================
   NEXT ROUND
========================================================= */

nextRoundButton.addEventListener(
    "click",
    function() {

        round++;

        roundComplete.style.display =
            "none";

        /*
            Every round starts with
            original 5 lives.
        */

        gameRunning = true;
        gamePaused = false;

        setupRound();

        startMovementLoop();
    }
);


/* =========================================================
   CAT FIREWORKS
========================================================= */

function createCatFireworks() {

    fireworks.innerHTML = "";

    const emojis = [
        "🐱",
        "🐾",
        "✨",
        "💥",
        "🌟",
        "😺",
        "🍎"
    ];


    for (let burst = 0; burst < 7; burst++) {

        const centerX =
            15 + Math.random() * 70;

        const centerY =
            15 + Math.random() * 70;


        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const particle =
                document.createElement("div");

            particle.className =
                "catFirework";

            particle.textContent =
                emojis[
                    Math.floor(
                        Math.random() *
                        emojis.length
                    )
                    ];

            particle.style.left =
                centerX + "%";

            particle.style.top =
                centerY + "%";


            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                70 +
                Math.random() * 150;


            particle.style.setProperty(
                "--x",
                Math.cos(angle) *
                distance +
                "px"
            );

            particle.style.setProperty(
                "--y",
                Math.sin(angle) *
                distance +
                "px"
            );


            particle.style.animationDelay =
                Math.random() *
                .5 +
                "s";


            fireworks.appendChild(
                particle
            );
        }
    }
}


/* =========================================================
   GAME OVER
========================================================= */

function endGame() {

    gameRunning = false;
    gamePaused = false;

    clearTimeout(appleSpawnTimer);
    clearTimeout(snakeSpawnTimer);

    movement.up = false;
    movement.down = false;
    movement.left = false;
    movement.right = false;

    gameOverNote.textContent =
        "PUYOT! 😂";

    finalRound.textContent =
        "You reached Round " +
        round +
        "! 🐱🔥";

    gameOverScreen.style.display =
        "flex";
}


/* =========================================================
   FULL RESTART
========================================================= */

function restartGame() {

    gameRunning = false;
    gamePaused = false;

    round = 1;

    score = 0;
    lives = 5;

    appleGoal = 10;

    clearObjects();

    clearTimeout(appleSpawnTimer);
    clearTimeout(snakeSpawnTimer);

    movement.up = false;
    movement.down = false;
    movement.left = false;
    movement.right = false;

    roundComplete.style.display =
        "none";

    gameOverScreen.style.display =
        "none";

    pauseMessage.style.display =
        "none";

    startScreen.style.display =
        "flex";

    pauseButton.textContent =
        "⏸️ Pause";

    updateUI();

    resetCat();
}


/* =========================================================
   BUTTON EVENTS
========================================================= */

startButton.addEventListener(
    "click",
    function() {

        startGame();
    }
);


restartButton.addEventListener(
    "click",
    function() {

        restartGame();
    }
);


restartGameButton.addEventListener(
    "click",
    function() {

        restartGame();

        /*
            Immediately start after
            PLAY AGAIN.
        */

        startGame();
    }
);


pauseButton.addEventListener(
    "click",
    function() {

        togglePause();
    }
);


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    function() {

        if (!gameRunning) {

            resetCat();

            return;
        }

        placeCat();

        /*
            Keep snakes inside the game
            after screen resizing.
        */

        snakes.forEach(snake => {

            snake.x =
                Math.max(
                    0,
                    Math.min(
                        snake.x,
                        getGameWidth() - 45
                    )
                );

            snake.y =
                Math.max(
                    0,
                    Math.min(
                        snake.y,
                        getGameHeight() - 35
                    )
                );
        });
    }
);


/* =========================================================
   INITIAL GAME STATE
========================================================= */

updateUI();

resetCat();

startMovementLoop();