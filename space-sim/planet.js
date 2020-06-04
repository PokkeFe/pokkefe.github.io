class Planet {
    constructor(r, d, o) {
        this.vector = createVector(random(0, 1), random(0, 1), random(0, 1));
        this.radius = r;
        this.angle = random(TWO_PI);
        this.distance = d;
        this.children = [];
        this.color = color(255, 255, 255);
        this.orbitSpeed = o;
        this.texture = null;
        this.isLightSource = false;


        this.vector.normalize();
        this.vector.mult(this.distance);
    }

    setTexture(newTexture) {
        this.texture = newTexture;
    }

    setLightSource(value) {
        this.isLightSource = value;
    }

    show() {
        push();

        if (this.orbitSpeed != 0) {
            let v2 = createVector(1, 0, 1);
            let p = this.vector.cross(v2);
            rotate(this.angle, p);
            stroke(255);
            strokeWeight(0.5);
            //line(0, 0, 0, this.vector.x, this.vector.y, this.vector.z);
        }

        translate(this.vector.x, this.vector.y, this.vector.z);
        noStroke();

        push();
        if (this.isLightSource) {
            shininess(100);
            ambientLight(255, 255, 0);
        }
        if (this.texture != null) {
            noFill();
            texture(this.texture);
        } else {
            fill(this.color);
        }
        sphere(this.radius);

        pop();
        for (let child of this.children) {
            child.show();
        }

        pop();
    }

    orbit() {
        this.angle = this.angle + this.orbitSpeed;

        for (let child of this.children) {
            child.orbit();
        }
    }

    addChild(body) {
        this.children.push(body);
    }

    setColor(newColor) {
        this.color = newColor;
    }
}