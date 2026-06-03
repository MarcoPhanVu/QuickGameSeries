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
document.getElementById("stopButton").addEventListener("click", () => {
    clearInterval(interval);
    console.log("stopped");
});

let lastSpawnTime = Date.now();
const SPAWN_INTERVAL = 3600; // ms
let deltaTime, currentTime;

// Physic variables
let gravity = 2;
let groundFriction = 0.9;
let horizontalFriction = 0.9;
let MAX_BOUNCE_VERTICAL = 6;
let MAX_BOUNCE_HORIZONTAL = 6;

// Interactions
let RightPressed = false;
let LeftPressed = false;
let UpPressed = false;
let DownPressed = false;
let SpacePressed = false;

class Ball {
    constructor(id, x, y, radius, color, moveX, moveY) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.moveX = moveX;
        this.moveY = moveY;
        this.verticalBounceCount = 0;
        this.horizontalBounceCount = 0;
    }

    update(ballList) {
        this.x += this.moveX;
        this.x = Math.round(this.x);
        this.y += this.moveY;
        this.y = Math.round(this.y);
        this.moveY += gravity;
        this.moveY = Math.round(this.moveY);

        // Collisions
        // Ground (no sky limit)
        if (this.y + this.radius > canvas.height) {
            this.verticalBounceCount += 1;
            if (this.verticalBounceCount <= MAX_BOUNCE_VERTICAL) {
                this.y = canvas.height - this.radius;
                this.moveY = -this.moveY * groundFriction; // Bounce with some energy loss
            } else {
                this.removeSelf(ballList);
                return;
            }
        }

        // Left and Right Walls
        if (
            (this.x + this.radius > canvas.width && this.moveX > 0) ||
            (this.x <= this.radius && this.moveX < 0)
        ) {
            this.horizontalBounceCount += 1;
            if (this.horizontalBounceCount <= MAX_BOUNCE_HORIZONTAL) {
                this.moveX = -this.moveX * horizontalFriction;
            } else {
                this.removeSelf(ballList);
                return;
            }
        }

        // updateStats
        let row = document.getElementById(`ball-${this.id}`);
        row.cells[1].innerText = `X: ${this.x} - Y: ${this.y}`;
        // row.cells[2].innerText = `Y: ${this.y}`;
    }

    draw() {
        painter.beginPath();
        painter.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        painter.arc(this.x, this.y, 1, 0, Math.PI * 2);
        painter.fillStyle = this.color;
        painter.fill();
        painter.closePath();
    }

    removeSelf(ballList) {
        let ballIndex = ballList.indexOf(this);
        if (ballIndex >= 0) {
            ballList.splice(ballIndex, 1);
            removeBallRow(this);
        }
    }
}

let ballList = [];

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
        ballList[i].update(ballList);
    }

    if (Date.now() - lastSpawnTime >= SPAWN_INTERVAL) {
        spawnBall();
        spawn5Balls();
        console.log("spawned 1");
        lastSpawnTime = Date.now();
    }
}

function spawn5Balls() {
    spawnBall();
    spawnBall();
    spawnBall();
    spawnBall();
    spawnBall();
    console.log("spawned 5");
}

let nextBallId = 1;
function spawnBall() {
    let ballRadius = RandomFromMinToMax(30, 50);
    let newBall = new Ball(
        nextBallId++,
        RandomFromMinToMax(ballRadius, canvas.width * 0.8), // X possition
        RandomFromMinToMax(ballRadius, canvas.height * 0.6), // Y possition
        ballRadius,
        colorList[RandomFromMinToMax(0, colorList.length)], // color
        RandomFromMinToMax(-32, 32), // X velocity
        RandomFromMinToMax(-5, 32), // Y velocity
    );

    addBallRow(newBall);
    ballList.push(newBall);
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
    cursorPosXValue.innerText = cursor.position.x;
    cursorPosYValue.innerHTML = cursor.position.y;
    // Vertical bounds
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

function checkBallInCursor() {
    //
}

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

function addBallRow(ball) {
    let row = debugTable.insertRow();
    row.id = `ball-${ball.id}`;
    let ballID = row.insertCell(0);
    let ballPos = row.insertCell(1);
    ballID.innerText = ball.id;
    ballPos.innerText = `X: ${ball.x} - Y: ${ball.y}`;
}

function removeBallRow(ball) {
    let row = document.getElementById(`ball-${ball.id}`);
    if (row) row.remove();
}
