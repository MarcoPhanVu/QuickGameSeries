const canvas = document.getElementById("canvas");
const painter = canvas.getContext("2d");

const debugTable = document.getElementById("debug-table");
console.log(debugTable);
let gameSpeed = 1000 / 60;
let interval = setInterval(gameHandler, gameSpeed);

// Physic variables
let gravity = 1;
let groundFriction = 0.8;
let horizontalFriction = 0.8;

let ball = {
    x: 100,
    y: 100,
    radius: 30,
    color: "#EF8354",
    initialMomentum: {
        x: 8,
        y: -8,
    },
};

function gameHandler() {
    painter.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(ball.x, ball.y, ball.radius, ball.color);
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
        ball.y = canvas.height - ball.radius;
        ball.initialMomentum.y = -ball.initialMomentum.y * groundFriction; // Bounce with some energy loss
    }
    // Left and Right Walls

    if (
        (ball.x + ball.radius > canvas.width && ball.initialMomentum.x > 0) ||
        (ball.x <= ball.radius && ball.initialMomentum.x < 0)
    ) {
        ball.initialMomentum.x = -ball.initialMomentum.x * horizontalFriction;
    }

    console.log(canvas.width);
}

function updateStatsTable() {}
