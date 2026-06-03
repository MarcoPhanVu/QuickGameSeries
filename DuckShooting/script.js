const canvas = document.getElementById("canvas");
const painter = canvas.getContext("2d");

const debugTable = document.getElementById("debug-table");
console.log(debugTable);
let gameSpeed = 1000 / 60;
let interval = setInterval(gameHandler, gameSpeed);

// Physic variables
let gravity = 1;
let groundFriction = 0.7;
let horizontalFriction = 0.7;

// Interactions
let RightPressed = false;
let LeftPressed = false;
let UpPressed = false;
let DownPressed = false;
let SpacePressed = false;

let ball = {
    x: 100,
    y: 100,
    radius: 50,
    color: "#54ef61",
    initialMomentum: {
        x: 8,
        y: -8,
    },
    horizontalBounceCount: 0,
    verticalBounceCount: 0,
};

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
    drawBall(ball.x, ball.y, ball.radius, ball.color);
    drawCursor(cursor);
    updateCursor();
}

function drawBall(x, y, radius, color) {
    // Draw Ball
    painter.beginPath();
    painter.arc(x, y, radius, 0, Math.PI * 2, false);
    painter.arc(x, y, 1, 0, Math.PI * 2);
    painter.fillStyle = color;
    painter.fill();
    painter.closePath();

    // Handle Ball Movement
    ball.x += ball.initialMomentum.x;
    ball.y += ball.initialMomentum.y;
    ball.initialMomentum.y += gravity;

    // Collisions
    // Ground
    if (ball.y + ball.radius > canvas.height) {
        ball.verticalBounceCount += 1;
        if (ball.verticalBounceCount >= 3) {
        }
        ball.y = canvas.height - ball.radius;
        ball.initialMomentum.y = -ball.initialMomentum.y * groundFriction; // Bounce with some energy loss
    }
    // Left and Right Walls
    if (
        (ball.x + ball.radius > canvas.width && ball.initialMomentum.x > 0) ||
        (ball.x <= ball.radius && ball.initialMomentum.x < 0)
    ) {
        ball.horizontalBounceCount += 1;

        ball.initialMomentum.x = -ball.initialMomentum.x * horizontalFriction;
    }

    // console.log(canvas.width);
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
//     initialMomentum: {
//         x: 8,
//         y: -8,
//     },
//     horizontalBounceCount: 0,
//     verticalBounceCount: 0,
// };

class Ball {
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

    // Handle Ball Movement
    // ball.x += ball.initialMomentum.x;
    // ball.y += ball.initialMomentum.y;
    // ball.initialMomentum.y += gravity;

    // // Collisions
    // // Ground
    // if (ball.y + ball.radius > canvas.height) {
    //     ball.verticalBounceCount += 1;
    //     if (ball.verticalBounceCount >= 3) {
    //     }
    //     ball.y = canvas.height - ball.radius;
    //     ball.initialMomentum.y = -ball.initialMomentum.y * groundFriction; // Bounce with some energy loss
    // }
    // // Left and Right Walls
    // if (
    //     (ball.x + ball.radius > canvas.width && ball.initialMomentum.x > 0) ||
    //     (ball.x <= ball.radius && ball.initialMomentum.x < 0)
    // ) {
    //     ball.horizontalBounceCount += 1;

    //     ball.initialMomentum.x = -ball.initialMomentum.x * horizontalFriction;
    // }
}
