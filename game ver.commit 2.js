//patch 1 : 벽돌 / 공 / 바 그리기,  충돌 감지, 공-벽, 공-블록, 공-바, 공-바닥 상호작용, 키보드 동작, 목숨 3개 및 end.html로 이동

//patch 2 : html body에 p 태그 #col,row에서 행렬 개수 가져옴, 블록을 다 깼을 시 다음 단계로 넘어, 3단계 까지 갔을경우 end로 이동,

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let ballRadius = 10; //ball 속성, startX이며 공 위치
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -2;

let paddleHeight = 10; //바 높이, 길이, 생성위치
let paddleWidth = 80;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddledx = 7;

let rightPressed = false;
let leftPressed = false;

//5x5 블록, 블록 너비 높이, 벽돌 간 간격, 벽돌-벽 간격
let brickRowCount = 5;
let brickColumnCount = 5;
let brickWidth = 85;
let brickHeight = 30;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let life = 3;

function loadbrick() {
    //html body에 p 태그 #col,row에서 블록 칸수를 때옴
    //무조건 상단 배치 
    let redrow = document.getElementById("row");
    let redcol = document.getElementById("col");
    let row = Number(redrow.innerText);
    let col = Number(redcol.innerText);
    brickColumnCount = col;
    brickRowCount = row;
}

loadbrick(); //실행 해줘야 brickRowCount 값이 바뀜



let bricks = []; //벽돌 생성
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBall() { //공 그리기
    ctx.beginPath();
    ctx.arc(x/** */, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFBBC6";
    //색 설정 js 호출
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() { //바 그리기
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#648CFF";
    //색 설정 js 호출
    ctx.fill();
    ctx.closePath();
}




function drawBricks() { //벽돌 좌표 지정 + 그리기
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                //이미지 출력 함수로 변경, X, Y 각 +5 를 하고 가로 세로 -10으로 히트박스와 이미지의 차이를 이용하여 공의 외벽을 맞는것을 구현
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() { //벽돌 충돌 감지 , 가끔 튕기는건 히트박스와 이미지상의 차이를 매꾸지 않음
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if ( //밑면 히트박스 제작
                    x >= b.x &&
                    x <= b.x + brickWidth &&
                    (y == b.y || y == b.y + brickHeight)
                ) {
                    dy = -dy;
                    b.status = 0;
                    // b.arrangeItem();
                    // b.itemEffect();
                    //아이템 발동 함수
                    //callScore(); //점수 함수
                }

                if ( //옆면 히트박스 구현 옆면을 맞을때 그 왼쪽에 있는 애들이 싹다 지워짐
                    y >= b.y &&
                    y <= b.y + brickHeight &&
                    (x == b.x || x == b.x + brickWidth)
                ) {
                    dx = -dx;
                    b.status = 0;
                    // b.arrangeItem();
                    // b.itemEffect();
                    //아이템 발동 함수
                    //callScore(); //점수 함수
                }
            }
        }
    }
}

function nextstage() { //다음 level 이동
    let flag = 1; //블록이 전부 깨졌을 때 1
    let URL = window.location.href;
    for (let c = 0; c < brickColumnCount; c++) {  //블록이 깨진지 확인
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                flag = 0;
                break;
            }
        }
    }
    if (flag == 1) { //현 페이지 기준으로 다음 스테이지 이동
        if (URL.endsWith('level1.html')) {
            location.href = 'level2.html';
        }
        else if (URL.endsWith('level2.html')) {
            location.href = 'level3.html';
        }
        else if (URL.endsWith('level3.html')) {
            location.href = 'level3.html';
        }
        else if (URL.endsWith('level2.html')) {
            location.href = 'level3.html';
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle(); 
    move();         //추락했을 경우 init setBall 출력
    collisionDetection();
    nextstage();

    requestAnimationFrame(draw);
}

function move() {
    if (x + dx > canvas.width - ballRadius ||
        x + dx < ballRadius) { //좌우 벽, 공의 다음x 위치가 반지름보다 작을 경우
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        //윗 벽, 다음 위치가 반지름보다 작을 경우
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) { //공이 바닥이지만, 바에 맞을 경우
            dy = -dy;
        } else { // 공이 나갈 경우
            life--;
            init();
        }
    }
    x += dx; //벽, 바닥 충돌 없을경우 일반 이동
    y += dy;

    if (rightPressed && paddleX < canvas.width - paddleWidth) { //paddle 동작
        paddleX += paddledx;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddledx;
    }
}

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

/*
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
*/

$(document).keydown(keyDownHandler);
$(document).keyup(keyUpHandler);

function init() {
    //바닥 맞았을 경우 game over 판정 및 위치 초기화 함수
    if (life == 0) {
        location.href = 'end.html';
    }

    setBall();
    setPaddle();
}

function setBall() { //공위치, 속도 초기화
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
}

function setPaddle() { //패들 위치, 크기, 속도 초기화
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleWidth = 80;
    paddledx = 7;
}

draw();