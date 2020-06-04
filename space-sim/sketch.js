let sun;
let merc;
let mercMoon;
let venus;

let img;

function setup() {
    createCanvas(600, 600, WEBGL);
    img = loadImage("data/sun.jpg");
    sun = new Planet(50, 0, 0);
    sun.setTexture(img);
    sun.setColor(color(255, 255, 0));

    img = loadImage("data/mercury.jpg");
    merc = new Planet(20, 100, 0.005);
    merc.setColor(color(230, 200, 0));
    merc.setTexture(img);

    img = loadImage("data/mercurymoon.jpg");
    mercMoon = new Planet(5, 30, 0.01);
    mercMoon.setColor(190, 190, 190);
    mercMoon.setTexture(img);
    merc.addChild(mercMoon);

    sun.addChild(merc);

    img = loadImage("data/venus.jpg");
    venus = new Planet(30, 200, 0.002);
    venus.setColor(color(0, 230, 100));
    venus.setTexture(img);
    sun.addChild(venus);

    sun.setLightSource(true);

    createEasyCam();
    document.oncontextmenu = function() { return false }

}

function draw() {
    background(51);
    lightFalloff(0.5, 0, 0);
    pointLight(255, 255, 0, 0, 0, 0);
    translate(0, 0);
    sun.show();
    sun.orbit();

}