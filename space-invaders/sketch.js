let ship;
let shipSpeed = 2;
let flowers = [];
let numFlowers = 5;
let shots = [];

let gameState = 0;

let game;

function setup() {
    createCanvas(600, 400);
    ship = new Ship();
    for (let i = 0; i < numFlowers; i++) {
        flowers[i] = new Flower(random(0, width), 20);
    }

    game = new Game();
}

function keyPressed() {
    game.keyPressed();
}

function keyReleased() {
    game.keyReleased();
}

function draw() {
    if (game.gameState == 0) {
        game.showMenu();
    } else if (game.gameState == 1) {
        game.play();
    } else if (game.gameState == 2) {
        game.endGame();
    }
}