const canvas = document.getElementById("canvas");
const painter = canvas.getContext("2d");

const debugTable = document.getElementById("debug-table");
console.log(debugTable);
let gameSpeed = 1000 / 60;
let interval = setInterval(gameHandler, gameSpeed);

// Physic variables
let gravity = 1;
let groundFriction = 0.8;
let horizontalFriction = 1;

// Interactions
let RightPressed = false;
let LeftPressed = false;
let UpPressed = false;
let DownPressed = false;
let SpacePressed = false;

class Ball {
    MAX_BOUNCE_VERTICAL = 10;
    MAX_BOUNCE_HORIZONTAL = 6;

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
ballList.push(new Ball(200, 40, 40, "blue", 10, -10));
ballList.push(new Ball(250, 200, 45, "red", -10, -40));
ballList.push(new Ball(150, 10, 50, "orange", 20, -30));

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
    drawBall();
}

function drawBall() {
    for (let i = 0; i < ballList.length; i++) {
        ballList[i].draw();
        ballList[i].update();
    }
}

function spawnBall() {}

// function drawBall(ball) {
//     // Draw Ball
//     painter.beginPath();
//     painter.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
//     painter.arc(ball.x, ball.y, 1, 0, Math.PI * 2);
//     painter.fillStyle = ball.color;
//     painter.fill();
//     painter.closePath();

//     // Handle Ball Movement
//     ball.x += ball.moveX;
//     ball.y += ball.moveX;
//     ball.moveX += gravity;

//     // Collisions
//     // Ground
//     if (ball.y + ball.radius > canvas.height) {
//         ball.verticalBounceCount += 1;
//         if (ball.verticalBounceCount >= 3) {
//         }
//         ball.y = canvas.height - ball.radius;
//         ball.moveX = -ball.moveX * groundFriction; // Bounce with some energy loss
//     }
//     // Left and Right Walls
//     if (
//         (ball.x + ball.radius > canvas.width && ball.moveX > 0) ||
//         (ball.x <= ball.radius && ball.moveX < 0)
//     ) {
//         ball.horizontalBounceCount += 1;

//         ball.moveX = -ball.moveX * horizontalFriction;
//     }

//     // console.log(canvas.width);
// }

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

// let ball = {
//     x: 100,
//     y: 100,
//     radius: 50,
//     color: "#54ef61",
//     moveX{
//         x: 8,
//         y: -8,
//     },
//     horizontalBounceCount: 0,
//     verticalBounceCount: 0,
// };
