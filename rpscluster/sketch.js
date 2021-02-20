let actors = [];

function setup() {
    createCanvas(500, 500);
    for(let i = 0; i < 50; i++) {
        actors.push(new Actor(random(width), random(height), int(random(3))%3));
    }
}

function draw() {
    background(51);
    for(let ac of actors) {
        ac.update(actors)
        ac.draw();
    }
}