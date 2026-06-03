const canvas = document.getElementById("canvas");
const painter = canvas.getContext("2d");

const debugTable = document.getElementById("debug-table");
const cursorPosXValue = document.getElementById("cursorPosXValue");
const cursorPosYValue = document.getElementById("cursorPosYValue");
console.log(debugTable);

let colorList = [
    "#EF8354",
    "#F5E3E0",
    "#E8B4BC",
    "#D282A6",
    "#6E4555",
    "#3A3238",
    "#F87575",
    "#FFA9A3",
    "#B9E6FF",
    "#5C95FF",
    "#FFBA08",
    "#D00000",
    "#FAD4C0",
    "#64B6AC",
    "#DAC4F7",
    "#E88D67",
    "#FCFC62",
    "#BBD686",
    "#B5D99C",
    "#008148",
    "#034732",
];

let gameSpeed = 1000 / 60;
let interval = setInterval(gameHandler, gameSpeed);
let lastSpawnTime = Date.now();
const SPAWN_INTERVAL = 400; // 5 secs
let deltaTime, currentTime;

// Physic variables
let gravity = 3;
let groundFriction = 0.9;
let horizontalFriction = 0.9;

// Interactions
let RightPressed = false;
let LeftPressed = false;
let UpPressed = false;
let DownPressed = false;
let SpacePressed = false;

class Ball {
    MAX_BOUNCE_VERTICAL = 4;
    MAX_BOUNCE_HORIZONTAL = 4;

    constructor(x, y, radius, color, moveX, moveY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.moveX = moveX;
        this.moveY = moveY;
        this.verticalBounceCount = 0;
        this.horizontalBounceCount = 0;
    }

    update() {
        this.x += this.moveX;
        this.y += this.moveY;
        this.moveY += gravity;

        // Collisions
        // Ground (no sky limit)
        if (this.y + this.radius > canvas.height) {
            this.verticalBounceCount += 1;
            if (this.verticalBounceCount <= this.MAX_BOUNCE_VERTICAL) {
                this.y = canvas.height - this.radius;
                this.moveY = -this.moveY * groundFriction; // Bounce with some energy loss
            }
        }

        // Left and Right Walls
        if (
            ((this.x + this.radius > canvas.width && this.moveX > 0) ||
                (this.x <= this.radius && this.moveX < 0)) &&
            this.horizontalBounceCount <= this.MAX_BOUNCE_HORIZONTAL
        ) {
            this.horizontalBounceCount += 1;
            this.moveX = -this.moveX * horizontalFriction;
        }
    }

    draw() {
        painter.beginPath();
        painter.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        painter.arc(this.x, this.y, 1, 0, Math.PI * 2);
        painter.fillStyle = this.color;
        painter.fill();
        painter.closePath();
    }
}

let ballList = [];
// ballList.push(new Ball(200, 40, 40, "blue", 10, -10));
// ballList.push(new Ball(250, 200, 45, "red", -10, -40));
// ballList.push(new Ball(150, 10, 50, "orange", 20, -30));

let cursor = {
    position: {
        x: 100,
        y: 100,
    },
    radius: 40,
    color: "#54d0ef",
    movement: {
        x: 8,
        y: -8,
    },
    speed: 7,
};

function gameHandler() {
    painter.clearRect(0, 0, canvas.width, canvas.height);
    drawCursor(cursor);
    updateCursor();

    for (let i = 0; i < ballList.length; i++) {
        ballList[i].draw();
        ballList[i].update();
    }

    if (Date.now() - lastSpawnTime >= SPAWN_INTERVAL) {
        spawnBall();
        console.log("spawn");
        lastSpawnTime = Date.now();
    }
}

function spawnBall() {
    let ballRadius = RandomFromMinToMax(30, 50);
    ballList.push(
        new Ball(
            RandomFromMinToMax(ballRadius, canvas.width * 0.8), // X possition
            RandomFromMinToMax(ballRadius, canvas.height * 0.6), // Y possition
            ballRadius,
            colorList[RandomFromMinToMax(0, colorList.length)], // color
            RandomFromMinToMax(-32, 32), // X velocity
            RandomFromMinToMax(-5, 32), // Y velocity
        ),
    );
}

function drawCursor(cursor) {
    painter.beginPath();
    painter.arc(
        cursor.position.x,
        cursor.position.y,
        cursor.radius,
        0,
        Math.PI * 2,
        false,
    );
    // Inner aim
    painter.arc(cursor.position.x, cursor.position.y, 5, 0, Math.PI * 2);
    painter.fillStyle = cursor.color;
    painter.stroke();
    painter.closePath();
}

function updateCursor() {
    speed = cursor.speed;
    if (RightPressed) {
        cursor.position.x += speed;
    }
    if (LeftPressed) {
        cursor.position.x -= speed;
    }
    if (UpPressed) {
        cursor.position.y -= speed;
    }
    if (DownPressed) {
        cursor.position.y += speed;
    }

    if (SpacePressed) {
        // console.log("shot");
        checkBallInCursor();
    }

    // Collisions
    // Vertical bounds
    // cursorPosXValue.innerText = cursor.
    if (cursor.position.y + cursor.radius >= canvas.height) {
        cursor.position.y = canvas.height - cursor.radius;
        console.log("bound reached");
    }

    if (cursor.position.y - cursor.radius <= 0) {
        cursor.position.y = cursor.radius;
    }

    // Left and Right Walls
    if (cursor.position.x + cursor.radius >= canvas.width) {
        cursor.position.x = canvas.width - cursor.radius;
        console.log("bound reached");
    }

    if (cursor.position.x - cursor.radius <= 0) {
        cursor.position.x = cursor.radius;
    }
}

function randomBallSpawn() {}

function updateStatsTable() {}

function RandomFromMinToMax(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

document.addEventListener("keydown", KeyPressedHandler, false);
document.addEventListener("keyup", KeyReleasedHandler, false);
// document.addEventListener("mousemove", MouseMovingHandler, false);

function KeyPressedHandler(k) {
    console.log(k.key + " pressed");
    // Movement
    if (k.key == "ArrowRight" || k.key == "d") {
        RightPressed = true;
    }
    if (k.key == "ArrowLeft" || k.key == "a") {
        LeftPressed = true;
    }
    if (k.key == "ArrowUp" || k.key == "w") {
        UpPressed = true;
    }
    if (k.key == "ArrowDown" || k.key == "s") {
        DownPressed = true;
    }

    // Interaction
    if (k.key == " ") {
        SpacePressed = true;
    }
}

function KeyReleasedHandler(k) {
    if (k.key == "ArrowRight" || k.key == "d") {
        RightPressed = false;
    }
    if (k.key == "ArrowLeft" || k.key == "a") {
        LeftPressed = false;
    }
    if (k.key == "ArrowUp" || k.key == "w") {
        UpPressed = false;
    }
    if (k.key == "ArrowDown" || k.key == "s") {
        DownPressed = false;
    }

    if (k.key == " ") {
        SpacePressed = false;
    }
}
