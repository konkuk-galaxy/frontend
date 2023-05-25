//patch 1 : 벽돌 / 공 / 바 그리기,  충돌 감지, 공-벽, 공-블록, 공-바, 공-바닥 상호작용, 키보드 동작, 목숨 3개 및 end.html로 이동

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let ballRadius = 10; //ball 속성, startX이며 공 위치
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
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

const imgBricks = new Image();
imgBricks.onload = draw;
imgBricks.src = "img/bricks.jpg"

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
                ctx.drawImage(imgBricks, brickX, brickY - 12, 73, 24);
                ctx.closePath();
            } } }
}

var score=0;
function callScore(jewel){/*점수함수*/
    var bonus;
    if(jewel==1)
        bonus=2;
    else if(jewel==2)
        bonus=4;
    else if(jewel==3)
        bonus=9;
    else if(jewel==0)
        bonus=1;

    score=score+bonus;
}

function collisionDetection() { //벽돌 충돌 감지 , 가끔 튕기는건 히트박스와 이미지상의 차이를 매꾸지 않음
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if ( //밑면 히트박스 제작
                  x >= b.x && 
                  x <= b.x+brickWidth  && 
                  (y == b.y || y == b.y+brickHeight)
                ) {
                    dy = -dy;
                    b.status = 0;
                    // b.arrangeItem();
                    // b.itemEffect();
                    //아이템 발동 함수
                    callScore(0); //점수 함수
                }

                if ( //옆면 히트박스 구현 옆면을 맞을때 그 왼쪽에 있는 애들이 싹다 지워짐
                    y >= b.y && 
                    y <= b.y+brickHeight && 
                    (x == b.x || x == b.x+brickWidth)
                     ) {
                    dx = -dx;
                    b.status = 0;
                    // b.arrangeItem();
                    // b.itemEffect();
                    //아이템 발동 함수
                    callScore(0); //점수 함수
                     if( x >= b.x && /*공이 대각선으로 벽돌과 부딪혔을때 점수 2증가 하는것 방지*/
                  x <= b.x+brickWidth  && 
                  (y == b.y || y == b.y+brickHeight)
                  ){
                        score--;
                    }
                } } } } 
}

function arrangeItem() {
    if(breakBrick > 0 && itemUse < 1){
        if(getRandomInt(1, 1000) < 250){
            randomValue = getRandomInt(1, 1000);
           itemType=(randomValue - 1)/100 +1;
        }
        breakBrick = 0;
    }
} // 아이템 랜덤 배분 itemType 1~10까지, 깨질때마다 랜덤하게 배분 

function itemEffect() {
    if(itemPosX === 0 && itemPosY === 0){
        itemPosX = x;
        itemPosY = y;
    }
    itemPosY += 1;
    if(itemType === 1){
        //ctx.drawImage(image, Imgx,Imgy,Img width,Img height,brickX,brickY,width,height); --> 아이템 이미지
        // 1번 아이템 효과         
        itemType = 0;
        itemUse = 0;
        itemPosY = 10000;
    }
    if(itemType === 2){
        //ctx.drawImage(image, Imgx,Imgy,Img width,Img height,brickX,brickY,width,height); --> 아이템 이미지
        // 2번 아이템 효과  
        itemType = 0;       
        itemUse = 0;
        itemPosY = 10000;
    }
    if(itemType === 3){
        //ctx.drawImage(image, Imgx,Imgy,Img width,Img height,brickX,brickY,width,height); --> 아이템 이미지
        // 3번 아이템 효과   
        itemType = 0;      
        itemUse = 0;
        itemPosY = 10000;
    }
    if(itemType === 4){
        //ctx.drawImage(image, Imgx,Imgy,Img width,Img height,brickX,brickY,width,height); --> 아이템 이미지
        // 4번 아이템 효과     
        itemType = 0;    
        itemUse = 0;
        itemPosY = 10000;
    }
    if(itemType === 5){
        //ctx.drawImage(image, Imgx,Imgy,Img width,Img height,brickX,brickY,width,height); --> 아이템 이미지
        // 5번 아이템 효과     
        itemType = 0;    
        itemUse = 0;
        itemPosY = 10000;
    }
    if(itemType === 6){
        //ctx.drawImage(image, Imgx,Imgy,Img width,Img height,brickX,brickY,width,height); --> 아이템 이미지
        // 6번 아이템 효과     
        itemType = 0;    
        itemUse = 0;
        itemPosY = 10000;
    }
    if(itemType === 7){
        //ctx.drawImage(image, Imgx,Imgy,Img width,Img height,brickX,brickY,width,height); --> 아이템 이미지
        // 7번 아이템 효과       
        itemType = 0;  
        itemUse = 0;
        itemPosY = 10000;
    }
    if(itemType === 8){
        //ctx.drawImage(image, Imgx,Imgy,Img width,Img height,brickX,brickY,width,height); --> 아이템 이미지
        // 8번 아이템 효과    
        itemType = 0;     
        itemUse = 0;
        itemPosY = 10000;
    }
    if(itemType === 9){
        //ctx.drawImage(image, Imgx,Imgy,Img width,Img height,brickX,brickY,width,height); --> 아이템 이미지
        // 9번 아이템 효과      
        itemType = 0;   
        itemUse = 0;
        itemPosY = 10000;
    }
    if(itemType === 10){
        //ctx.drawImage(image, Imgx,Imgy,Img width,Img height,brickX,brickY,width,height); --> 아이템 이미지
        // 10번 아이템 효과         
        itemType = 0;
        itemUse = 0;
        itemPosY = 10000;
    }
    
    if(itemPosY > canvas.height){
        itemPosX = 0;
        itemPosY = 0;
        itemType = 0;
    }
    if(itemUse < 0)
        equipItem = 0;
    if(equipItem < 1)
        itemUse = 0;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle(); //추락했을 경우 init setBall 출력
    move();
    collisionDetection();


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


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function init() {
     //바닥 맞았을 경우 game over 판정 및 위치 초기화 함수
    if (life == 0) {
        localStorage.setItem('score',score);/*점수를 game.js로 전달*/
        location.href = 'end.html';
    }
    setBall();
    setPaddle();
}

function setBall () { //공위치, 속도 초기화
    x= canvas.width / 2;
    y= canvas.height - 30;
    dx=2;
    dy=-2;
} 

function setPaddle() { //패들 위치, 크기, 속도 초기화
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleWidth = 80;
    paddledx = 7;
}
