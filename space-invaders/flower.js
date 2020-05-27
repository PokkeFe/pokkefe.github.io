class Flower {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.perlinOffset = random(0, 100000);
        this.perlinSpeed = random(0.02, 0.04);
        this.r = 20;
        this.maxSpeed = 5;
        this.color = [0, 0, 0];
    }

    setColor(newColor) {
        this.color = newColor;
    }

    show() {
        push();
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.r, this.r)
        pop();
    }

    move() {
        this.pos.x += map(noise(this.perlinOffset), 0, 1, -this.maxSpeed, this.maxSpeed);
        this.pos.y += map(noise(this.perlinOffset + 500), 0, 1, -this.maxSpeed, this.maxSpeed);
        this.pos.x = constrain(this.pos.x, 0 + this.r, width - this.r);
        this.pos.y = constrain(this.pos.y, 0 + this.r, height / 2 - this.r);
        this.perlinOffset += this.perlinSpeed;
    }
}