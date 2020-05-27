class Game {
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
        this.score = 0;
        this.gameState = 0;
        this.gameData = {
            ship: new Ship(),
            shipSpeed: 2,
            flowers: [],
            numFlowers: 5,
            shots: [],
            maxShots: 3
        }
        this.colors = {
            background: [45, 42, 50],
            ship: [122, 147, 172],
            flower: [160, 70, 104],
            shot: [255, 94, 91],
            alt: [173, 168, 182]
        }
    }

    showMenu() {
        background(this.colors.background);
        push();
        rectMode(CENTER);
        textAlign(CENTER);
        noStroke();
        fill(this.colors.ship[0], 0, 0, 50);
        rect(width / 2, height / 2, 100, 1009);


        textSize(30);
        fill(this.colors.alt);
        text("ALIEN INVASION", width / 2, height / 2.25);

        textSize(20);
        fill(this.colors.flower);
        text("Try to eliminate all the orbs as fast as possible.", width / 2, height / 1.75);

        fill(this.colors.shot);
        text("Press Space to begin...", width / 2, height / 1.1);

        pop();
    }

    setupGame() {
        noStroke();
        for (let i = 0; i < this.gameData.numFlowers; i++) {
            this.gameData.flowers[i] = new Flower(random(0, width), random(0, height / 2));
            this.gameData.flowers[i].setColor(this.colors.flower);
        }
        this.gameData.ship.setColor(this.colors.ship);

        this.startTime = millis();
        this.gameState = 1;
    }

    play() {
        background(this.colors.background);
        this.gameData.ship.update();
        this.gameData.ship.show();


        for (let flower of this.gameData.flowers) {
            flower.move();
            flower.show();
        }

        for (let shot of this.gameData.shots) {
            shot.move();
            if (shot.isOut()) {
                this.gameData.shots.splice(this.gameData.shots.indexOf(shot), 1);
            } else {
                shot.show();
                for (let flower of this.gameData.flowers) {
                    if (shot.hits(flower)) {
                        this.gameData.flowers.splice(this.gameData.flowers.indexOf(flower), 1);
                        this.gameData.shots.splice(this.gameData.shots.indexOf(shot), 1);
                    }
                }
            }
        }

        if (this.gameData.flowers.length == 0) {
            this.endTime = millis();
            this.score = this.endTime - this.startTime;
            this.gameData.ship.resetVel();
            this.gameState = 2;
        }
    }



    keyPressed() {
        switch (this.gameState) {
            case 0:
                if (key === ' ') {
                    this.setupGame();
                }
                break;
            case 1:
                if (keyCode === RIGHT_ARROW) {
                    this.gameData.ship.addVel(this.gameData.shipSpeed, 0);
                }
                if (keyCode === LEFT_ARROW) {
                    this.gameData.ship.addVel(-this.gameData.shipSpeed, 0);
                }
                if (key === ' ') {
                    if (this.gameData.shots.length < this.gameData.maxShots) {
                        this.gameData.shots.push(this.gameData.ship.fire());
                        this.gameData.shots[this.gameData.shots.length - 1].setColor(this.colors.shot);
                    }
                }
                break;
            case 2:
                if (key === ' ') {
                    this.gameState = 0;
                }
                break;
        }
    }

    keyReleased() {
        switch (this.gameState) {
            case 0:
                break;
            case 1:
                if (keyCode === RIGHT_ARROW) {
                    this.gameData.ship.addVel(-this.gameData.shipSpeed, 0);
                }
                if (keyCode === LEFT_ARROW) {
                    this.gameData.ship.addVel(this.gameData.shipSpeed, 0);
                }
            case 2:
                break;
        }
    }

    endGame() {
        push()
        background(51);
        textSize(30);
        textAlign(CENTER);
        fill(this.colors.alt);
        text("Congratulations!", width / 2, height / 2.5);

        textSize(20);
        fill(this.colors.flower);
        text("You've defeated the invaders.", width / 2, height / 2);

        text("Your final score is: " + this.score, width / 2, height / 1.5);

        fill(this.colors.shot);

        text("Press Space to return to menu...", width / 2, height / 1.1);

        pop();
    }
}