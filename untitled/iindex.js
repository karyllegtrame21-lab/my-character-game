const character = document.getElementById("character");
const apple = document.getElementById("apple");
const scoreText = document.getElementById("score");
const game = document.getElementById("game");

let x = 100;
let y = 100;

let speed = 6;
let score = 0;

let keys = {};


// ======================
// KEYBOARD CONTROLS
// ======================

document.addEventListener("keydown", function(event) {

    keys[event.key] = true;

});

document.addEventListener("keyup", function(event) {

    keys[event.key] = false;

});


// ======================
// PHONE CONTROLS
// ======================

let buttons = {

    up: document.getElementById("up"),
    down: document.getElementById("down"),
    left: document.getElementById("left"),
    right: document.getElementById("right")

};


// Press / hold phone button

buttons.up.addEventListener("touchstart", function(event) {
    event.preventDefault();
    keys["ArrowUp"] = true;
});

buttons.up.addEventListener("touchend", function(event) {
    event.preventDefault();
    keys["ArrowUp"] = false;
});


buttons.down.addEventListener("touchstart", function(event) {
    event.preventDefault();
    keys["ArrowDown"] = true;
});

buttons.down.addEventListener("touchend", function(event) {
    event.preventDefault();
    keys["ArrowDown"] = false;
});


buttons.left.addEventListener("touchstart", function(event) {
    event.preventDefault();
    keys["ArrowLeft"] = true;
});

buttons.left.addEventListener("touchend", function(event) {
    event.preventDefault();
    keys["ArrowLeft"] = false;
});


buttons.right.addEventListener("touchstart", function(event) {
    event.preventDefault();
    keys["ArrowRight"] = true;
});

buttons.right.addEventListener("touchend", function(event) {
    event.preventDefault();
    keys["ArrowRight"] = false;
});


// ======================
// MOVE CHARACTER
// ======================

function moveCharacter() {

    if (keys["ArrowUp"] || keys["w"]) {
        y -= speed;
    }

    if (keys["ArrowDown"] || keys["s"]) {
        y += speed;
    }

    if (keys["ArrowLeft"] || keys["a"]) {
        x -= speed;
    }

    if (keys["ArrowRight"] || keys["d"]) {
        x += speed;
    }


    // Keep character inside game

    let maxX = game.clientWidth - character.offsetWidth;
    let maxY = game.clientHeight - character.offsetHeight;

    if (x < 0) {
        x = 0;
    }

    if (y < 0) {
        y = 0;
    }

    if (x > maxX) {
        x = maxX;
    }

    if (y > maxY) {
        y = maxY;
    }


    character.style.left = x + "px";
    character.style.top = y + "px";


    checkApple();

    requestAnimationFrame(moveCharacter);
}


// ======================
// CHECK APPLE
// ======================

function checkApple() {

    let characterRect = character.getBoundingClientRect();
    let appleRect = apple.getBoundingClientRect();


    if (

        characterRect.left < appleRect.right &&
        characterRect.right > appleRect.left &&
        characterRect.top < appleRect.bottom &&
        characterRect.bottom > appleRect.top

    ) {

        score++;

        scoreText.textContent = "Score: " + score;

        moveApple();

    }

}


// ======================
// MOVE APPLE
// ======================

function moveApple() {

    let maxX = game.clientWidth - apple.offsetWidth;
    let maxY = game.clientHeight - apple.offsetHeight;

    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;

    apple.style.left = newX + "px";
    apple.style.top = newY + "px";

}


// ======================
// START GAME
// ======================

moveCharacter();









