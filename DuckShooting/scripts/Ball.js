export class Ball {
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
