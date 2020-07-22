let webSocket = new WebSocket("ws://66.68.94.83:3000", "echo-protocol");

let users = []
let user = {
    x: 0,
    y: 0,
    r: 250,
    g: 0,
    b: 0,
    n: ''
}

function setup() {

    createCanvas(800, 800);

    user.r = int(random() * 255);
    user.g = int(random() * 255);
    user.g = int(random() * 255);

    user.n = randomName();
}

function draw() {
    background(51);
    stroke(255);
    drawUsers();
}

function drawUsers() {
    for (let usr of users) {
        stroke(usr.r, usr.g, usr.b);
        fill(usr.r, usr.g, usr.b);
        ellipse(usr.x, usr.y, 20, 20);
        text(usr.n, usr.x - 20, usr.y + 20);
    }
}

function randomName() {
    let fNames = ["Big", "Wide", "Thick", "Sexy", "Juicy", "Massive", "Hairy", "Chunky"];
    let lNames = ["Chungus", "Fox", "Wolf", "Woon", "Brute", "Boi", "Lad", "Chad", "Member"];

    return fNames[int(random() * fNames.length)] + " " + lNames[int(random() * lNames.length)];
}

webSocket.onopen = () => {
    webSocket.send(JSON.stringify(user));
}

webSocket.onmessage = (evt) => {
    console.log(evt);
    users = JSON.parse(evt.data);
}

function mouseMoved() {
    user.x = mouseX;
    user.y = mouseY;
    webSocket.send(JSON.stringify(user));
}

function mousePressed() {
    user.x = mouseX;
    user.y = mouseY;
    webSocket.send(JSON.stringify(user));
}