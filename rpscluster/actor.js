const ACTOR_ALLY_DIST = 50;
const ACTOR_ALLY_WEIGHT = 1;
const ACTOR_ALLY_REP_MAX = 5;
const ACTOR_PREY_WEIGHT = 10;
const ACTOR_PREDATOR_FLEE_THRESH = 30;
const ACTOR_PREDATOR_FLEE_WEIGHT = 10;

const ACTOR_PREY_CHANGE_DIST = 20;
const ACTOR_WALL_STEERING_WEIGHT = 10;
const ACTOR_RANDOMNESS = 0.1;

const WALL_AVOID_THRESH = 50;
const WALL_AVOID_WEIGHT = 2;

class Actor {
    constructor(x, y, type) {
        this.pos = createVector(x, y);
        this.type = type;

        this.speed = 0.5;
    }

    update(nearby) {
        // nearby is a list of all nearby actors
        let velocity = createVector(0, 0);
        for(let neighbor of nearby) {
            // if neighbor is me, skip
            if(neighbor == this) {
                continue;
            }

            let dist = this.pos.dist(neighbor.pos);
            if(neighbor.type == this.type) {
                // same species
                
                if(dist < ACTOR_ALLY_DIST) {
                    let f
                    if(dist == 0) {
                        f = ACTOR_ALLY_REP_MAX;
                    } else {
                        f = (1/dist) * ACTOR_ALLY_REP_MAX;
                    }
                    let v = p5.Vector.sub(this.pos, neighbor.pos);
                    v.setMag(ACTOR_ALLY_WEIGHT * f);
                    velocity.add(v);
                } else if(dist > ACTOR_ALLY_DIST) {
                    let v = p5.Vector.sub(neighbor.pos, this.pos);
                    v.setMag(ACTOR_ALLY_WEIGHT);
                    velocity.add(v);
                }
                
            }
            else if (neighbor.type == (this.type + 1) % 3) {
                // predator
                
                if(dist < ACTOR_PREDATOR_FLEE_THRESH) {
                    let v = p5.Vector.sub(this.pos, neighbor.pos);
                    v.setMag(ACTOR_PREDATOR_FLEE_WEIGHT);
                    velocity.add(v);
                }
                
            }
            else if (neighbor.type == (this.type - 1 + 3) % 3) {
                // prey
                let v = p5.Vector.sub(neighbor.pos, this.pos);
                v.setMag(ACTOR_PREY_WEIGHT);
                velocity.add(v);
                // if close enough to prey, trigger their change
                if(dist < ACTOR_PREY_CHANGE_DIST) {
                    neighbor.changeType(this.type);
                }
            }
        }
        // add steering away from walls
        /*
        if(this.pos.x < WALL_AVOID_THRESH) {
            // near left wall
            // add right velocity with mag 1/dist
            let d = this.pos.x;
            let v = createVector(1, 0);
            v.setMag(WALL_AVOID_WEIGHT/d);
        }
        */

        // add randomness
        velocity.add(p5.Vector.random2D());
        velocity.setMag(this.speed);
        this.pos.add(velocity);
        if(this.pos.x < 0) this.pos.x = 0;
        if(this.pos.y < 0) this.pos.y = 0;
        if(this.pos.x > width) this.pos.x = width;
        if(this.pos.y > height) this.pos.y = height;
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        textAlign(CENTER);
        rectMode(CENTER);
        text(ENUM.ActorEmoji[this.type], 0, 0);
        pop();
    }

    changeType(type) {
        this.type = type;
    }
}
