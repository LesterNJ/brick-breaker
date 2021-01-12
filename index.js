const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 5;
let brickColumnCount = 6;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 5;
let brickOffsetTop = 30;
let brickOffsetLeft = 2;
let score = 0;
let lives = 3;
let gameStarted = 0;
const startDisplay = document.getElementById('start');

let bricks = [];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(let i = 0; i < brickColumnCount; i++) {
        for(let j = 0; j < brickRowCount; j++) {
            let b = bricks[i][j];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#49fb35";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let i = 0; i < brickColumnCount; i++) {
        for(let j = 0; j < brickRowCount; j++) {
            if(bricks[i][j].status == 1) {
                let brickX = (i*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (j*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.beginPath();
                ctx.strokeStyle="rgba(0,0,0,1)";
                ctx.strokeRect(brickX, brickY, brickWidth, brickHeight);
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if(j % 2 == 0) {
                    ctx.fillStyle = "#0095DD";
                } else {
                    ctx.fillStyle = "#FFFFFF";
                }
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function start(){
    if(gameStarted === 0) {
        startDisplay.innerText = 'Quit';
        gameStarted = 1;
        x = canvas.width/2;
        y = canvas.height-30;
        for(let i = 0; i < brickColumnCount; i++) {
            bricks[i] = [];
            for(let j = 0; j < brickRowCount; j++) {
                bricks[i][j] = { x: 0, y: 0, status: 1 };
            }
        }
        draw();
    } else {
        gameStarted = 0;
        score = 0;
        lives = 3;
        startDisplay.innerText = 'New Game';
    }
  }

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval); // Needed for Chrome to end game
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    if(rightPressed) {
        paddleX += 7;
    }
    else if(leftPressed) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    if(gameStarted === 1) {
    requestAnimationFrame(draw);
    } else {
        
    }
}