class Ship {
    constructor() {
        this.pos = createVector(width / 2, height - 20);
        this.vel = createVector(0, 0);
        this.maxSpeed = 2;
        this.r = 10;
        this.color = [0, 0, 0];
    }

    setColor(newColor) {
        this.color = newColor;
    }

    update() {
        this.pos.add(this.vel);
        this.pos.x = constrain(this.pos.x, 0 + this.r, width - this.r);
        this.pos.y = constrain(this.pos.y, height / 2, height);
    }

    show() {
        push();
        fill(this.color);
        beginShape();
        vertex(this.pos.x, this.pos.y - this.r);
        vertex(this.pos.x - this.r, this.pos.y + this.r);
        vertex(this.pos.x, this.pos.y + this.r / 2);
        vertex(this.pos.x + this.r, this.pos.y + this.r);
        endShape(CLOSE);
        pop();
    }

    addVel(x, y) {
        this.vel.add(createVector(x, y));
        constrain(this.vel.x, -this.maxSpeed, this.maxSpeed);
        constrain(this.vel.y, -this.maxSpeed, this.maxSpeed);
    }

    resetVel() {
        this.vel = createVector(0, 0);
    }

    fire() {
        let shot = new Shot(this.pos.x, this.pos.y);
        return shot;
    }
}

class Shot {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.speed = 5;
        this.color = [0, 0, 0];
    }

    setColor(newColor) {
        this.color = newColor;
    }

    move() {
        this.pos.y = this.pos.y - this.speed;
    }

    show() {
        push();
        stroke(this.color);
        strokeWeight(5);

        line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + 10);
        pop();
    }

    hits(other) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d < 15) {
            return true;
        } else {
            return false;
        }
    }

    isOut() {
        if (this.pos.y < 0) {
            return true;
        } else {
            return false;
        }
    }
}