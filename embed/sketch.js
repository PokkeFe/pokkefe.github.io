const WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

let myBox;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    rectMode(CENTER);
    myBox = new Box(width/2, height/2);
}

function draw() {
    background(255);
    myBox.update();
    myBox.draw();
}

class Box {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.rot = 0;
        this.rotSpeed = 0.03;
    }

    update() {
        this.rot += this.rotSpeed;
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.rot);
        noStroke();
        fill(100);
        ellipse(0, 0, 40, 40);
        fill(255);
        ellipse(0, 0, 25, 25);
        rect(0, 0, 10, 41);
        fill(100);
        ellipse(0, 0, 10, 10);
        pop();
    }
}