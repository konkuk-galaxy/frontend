let difficulty = localStorage.getItem('difficulty');

let score = localStorage.getItem('score');
score = parseInt(score);
let level = localStorage.getItem('level');
level = parseInt(level);
let levelFlag = false;
let infostr = "esc키를 누르면 설정창이 열립니다. ";
let stagestr = "스테이지 : "
let tempstr2 = stagestr + level + "<br>" + "점수 : " + score;
$(function() {
    $("#info-setting").text(infostr);
    $("#stage-info").html(tempstr2);
})

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let ballRadius = 10; //ball 속성, startX이며 공 위치
let x = (canvas.width - 100) / 2;
let y = canvas.height - 30;

let dx = 1 * 2;
let dy = -1 * 2;

let paddleHeight = 10; //바 높이, 길이, 생성위치
let paddleWidth = 120;
let paddleX = (canvas.width - 100 - paddleWidth) / 2;
let paddledx = 5;

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

// 아이템 관련 변수
let breakBrick = 0;
let itemGroup = 0;
let itemType = 0;
let itemUse = 0;
let randomValue = 0;
let itemPosX = 0;
let itemPosY = 0;
let jewelType = 0;
let paddleitem = 0;
let itemLogX = 501;
let itemLogY = 20;
let itemCnt = 0;

let life = 3;

let gameMove; //requestAnimationFrame을 이 변수로 받아서 설정창이 열리면 애니매이션을 멈춤

let gameOn_Off = false; //게임이 실행되면 true로 바뀜, 게임 시작 전 설정을 키고 닫으면 공이 움직이는 문제때문에 만듬
let settingOn_Off = false;
let levelUp_used = false;

const imgBricks = new Image();
//imgBricks.onload = draw
imgBricks.src = "img/bricks.jpg"

const imgItem_ball = new Image();
imgItem_ball.src = "img/item_ball.jpg"

const imgItem_speed = new Image();
imgItem_speed.src = "img/item_speed.jpg"

const imgItem_paddlex2 = new Image();
imgItem_paddlex2.src = "img/item_paddlex2.jpg"

const imgItem_heart = new Image();
imgItem_heart.src = "img/item_heart.jpg"

const imgItem_diamond = new Image();
imgItem_diamond.src = "img/item_diamond.jpg"

const imgItem_ruby = new Image();
imgItem_ruby.src = "img/item_ruby.jpg"

const imgItem_saphire = new Image();
imgItem_saphire.src = "img/item_saphire.jpg"

const imgItem_mineral = new Image();
imgItem_mineral.src = "img/item_mineral.jpg"

const imgItem_gas = new Image();
imgItem_gas.src = "img/item_gas.jpg"

const imgItem_meteor = new Image();
imgItem_meteor.src = "img/item_meteor.png"

const imgHealthBar = new Image();
imgHealthBar.src = "img/health_Bar.png"

const imgLife = new Image();
imgLife.src = "img/life_text.png"

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

/* 점수 함수 */
function callScore(jewel){
    if(jewel === 0) // 평범한 자원 획득일 경우 1점 획득-->미네랄
        score += 1;
    else if(jewel === 1)//가스
        score += 3;
    else if(jewel === 2)//사파이어
        score += 5;
    else if(jewel === 3)//루비
        score += 7;
    else if(jewel === 4)//다이아몬드
        score += 10;
    
    let tempstr2 = stagestr + level + "<br>" + "점수 : " + score;
    $("#stage-info").html(tempstr2);

    console.log(jewel + "자원 획득 -> 점수 증가! " + score);
    if(difficulty == 1 && score >= 50)
    {
    localStorage.setItem('score', score); /* 점수를 end.js로 전달 */
    location.href = 'end.html';
    }
    if(difficulty == 2 && score >= 100)
    {
    localStorage.setItem('score', score); /* 점수를 end.js로 전달 */
    location.href = 'end.html';
    }
    if(difficulty == 3 && score >= 200)
    {
    localStorage.setItem('score', score); /* 점수를 end.js로 전달 */
    location.href = 'end.html';
    }
}

let bricks = []; //벽돌 생성
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBall() { //공 그리기
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}


function drawPaddle() { //바 그리기
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = blockColor;
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
            }
        }
    }
}

function adjustSpeed() {
    dx = dx > 0 ? dx - 0.5 : dx + 0.5;
    dy = dy > 0 ? dy - 0.5 : dy + 0.5;
}

function collisionDetection() { //벽돌 충돌 감지 , 가끔 튕기는건 히트박스와 이미지상의 차이를 매꾸지 않음
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if ( //밑면 히트박스 제작
                    x >= b.x &&
                    x <= b.x + brickWidth &&
                    ((y >= b.y && y <= b.y + 2) || //밑면 기준 안쪽으로 2만큼 판정구역 추가
                        (y <= b.y + brickHeight && y >= b.y + brickHeight - 2))
                ) {
                    dy = -dy;
                    b.status = 0;
                    breakBrick++;
                    // b.arrangeItem();
                    // b.itemEffect();
                    //아이템 발동 함수
                    //callScore(); //점수 함수
                }

                if ( //옆면 히트박스 구현 옆면을 맞을때 그 왼쪽에 있는 애들이 싹다 지워짐
                    y >= b.y &&
                    y <= b.y + brickHeight &&
                    ((x >= b.x && x <= b.x + 2) || //옆면 기준 안쪽으로 3만큼 판정구역 추가
                        (x <= b.x + brickWidth && x >= b.x + brickWidth - 2))
                ) {
                    dx = -dx;
                    b.status = 0;
                    breakBrick++;
                    // b.arrangeItem();
                    // b.itemEffect();
                    //아이템 발동 함수
                    //callScore(); //점수 함수
                }
                if ( // 안쪽 히트. 과속 방지를 위한 속도 조절
                    x >= b.x + 4 &&
                    x <= b.x + brickWidth -4 &&
                    y >= b.y + 2 &&
                    y <= b.y + brickHeight -2 
                ) {
                    adjustSpeed();
                    dx = -dx;
                    dy = -dy;
                    b.status = 0;
                    breakBrick++;
                }
            }
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function groupItem() {
    if ((breakBrick > 0 && itemUse < 1) || (breakBrick > 3))
    {
        randomValue = getRandomInt(1, 100);
        if(level >= 5)
        {
            if(randomValue <= (5 * 5 * difficulty))
            {
            itemGroup = 0;
            itemType = 1;
            }
            else
            {
            itemGroup = 1;
            itemType = getRandomInt(1,8);
            console.log(itemType)
            }
            console.log("randomValue : " + randomValue + " 운석 조건 : " + (5 * 5 * difficulty) + " itemGroup : " + itemGroup + " itemType : " + itemType);
        }
        else
        {
            if(randomValue <= (5 * level * difficulty))
            {
            itemGroup = 0;
            itemType = 1;
            }
            else
            {
            itemGroup = 1;
            itemType = getRandomInt(1,8);
            }
            console.log("randomValue : " + randomValue + " 운석 조건 : " + (5 * level * difficulty) + " itemGroup : " + itemGroup + " itemType : " + itemType);
        }

        itemUse++;
        breakBrick =0;
    }
} // 난이도와 스테이지에 따라 아이템 그룹 배분 itemGroup 0:운석,1:나머지 

function drawItem() { //
    if (itemLogY < 470 && itemLogX === 501) {
        itemLogY = 20;
        itemLogY += (itemCnt * 25);
    }
    if (itemLogY === 470) { // 아이템 아이콘 줄바꿈
        itemLogX = 527;
        itemLogY = 20;
    }
    if (itemLogY < 470 && itemLogX === 527) { // 아이템 아이콘 둘째줄
        itemLogY = 20;
        itemLogY = itemLogY + (itemCnt * 25) - 450;
    }
}
function itemEffect() {
    if (itemPosX === 0 && itemPosY === 0) {
        itemPosX = x - 20;
        itemPosY = y;
    }
    itemPosY += 5;
    if(itemGroup === 0) // 유성
    {
        ctx.drawImage(imgItem_meteor, itemPosX, itemPosY, 30, 50);
        if (itemPosX > paddleX && itemPosX < paddleX + paddleWidth && itemPosY > canvas.height - 20 && itemPosY < canvas.height) {
            life--;
            if(life === 0){ init();}
            itemType = 0;
            itemUse = 0;
            itemPosY = 10000;
        }
        if (itemPosX < paddleX && itemPosX > paddleX + paddleWidth && itemPosY > canvas.height - 20 && itemPosY < canvas.height) {
            itemType = 0;
            itemUse = 0;
            itemPosY = 10000;
        }
        itemUse = 0;
    }
    if(itemGroup === 1)
    {
        if (itemType === 1 || itemType === 2) { // 자원
            randomValue2 = getRandomInt(1, 1000);
            jewelType = Math.floor((randomValue2 - 1) / 200) + 1;
            if (jewelType === 1) {
                ctx.drawImage(imgItem_diamond, itemLogX, itemLogY, 24, 24);
                itemCnt++;
                drawItem();
                callScore(4);
            }
            if (jewelType === 2) {
                ctx.drawImage(imgItem_saphire, itemLogX, itemLogY, 24, 24);
                itemCnt++;
                drawItem();
                callScore(3);
            }
            if (jewelType === 3) {
                ctx.drawImage(imgItem_ruby, itemLogX, itemLogY, 24, 24);
                itemCnt++;
                drawItem();
                callScore(2);
            }
            if (jewelType === 4) {
                ctx.drawImage(imgItem_gas, itemLogX, itemLogY, 24, 24);
                itemCnt++;
                drawItem();
                callScore(1);
            }
            if (jewelType === 5) {
                ctx.drawImage(imgItem_mineral, itemLogX, itemLogY, 24, 24);
                itemCnt++;
                drawItem();
                callScore(0);
            }
            itemType = 0;
            itemUse = 0;
            jewelType = 0;
        }
        if (itemType === 3) { // 목숨을 늘려주는 아이템
            if(life < 4){
                life++;  
                ctx.drawImage(imgItem_heart, itemLogX, itemLogY, 24, 24);
                itemCnt++;
                drawItem(); 
            } 
            itemType = 0;
            itemUse = 0;
            itemPosY = 10000;
        }
        if (itemType === 4) { // 공 속도 변화

        dx = dx * 1.35;
        dy = dy * 1.35;

        ctx.drawImage(imgItem_speed, itemLogX, itemLogY, 24, 24);
        itemCnt++;
        drawItem();
        itemType = 0;
        itemUse = 0;
        }
        if (itemType === 5) { // 패들 크기 변화
            if (paddleitem < 3) {
                let recentPadWid = paddleWidth;
                paddleWidth = paddleWidth * 1.35;
                paddleX = paddleX - (paddleWidth - recentPadWid) ;
                //패들을 왼쪽으로만 늘림
                //오른쪽 아이템 창을 넘지 않음
                //그래도 +paddledx 만큼 이미지가 생김

                ctx.drawImage(imgItem_paddlex2, itemLogX, itemLogY, 24, 24);
                itemCnt++;
                drawItem();
                itemType = 0;
                itemUse = 0;
                itemPosY = 0;
            }   
            itemType = 0;
            itemUse = 0;
        }
        if (itemType === 6) { // 공 느리게
            dy = dy / 1.35;
            dx = dx / 1.35;
            ctx.drawImage(imgItem_ball, itemLogX, itemLogY, 24, 24);
            itemCnt++;
            drawItem();
            itemType = 0;
            itemUse = 0;
        }
        if (itemType === 7 || itemType === 8) { // 꽝
            itemType = 0;
            itemUse = 0;
        }
    }
    if (itemPosY > canvas.height) {
        itemPosX = 0;
        itemPosY = 0;
        itemType = 0;
    }
}

function nextstage() { 
    //다음 level 이동
    let flag = 1; //블록이 전부 깨졌을 때 1
    //let URL = window.location.href;
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
        //주소에 레벨을 비롯한 색상, 배경등의 정보를 함께 넘겨 줘서 그 정보를 바탕으로 현제 레벨을 파악함.
        //다음스테이지로 넘어갈때 레벨, 색상, 배경, bgm정보등을 url 주소에 포함시켜 넘겨줘야함
        localStorage.setItem('score',score); //점수 전달
        localStorage.setItem('ballColor',ballColor);
        localStorage.setItem('blockColor',blockColor);
        localStorage.setItem('background_IMg',background_IMg);
        localStorage.setItem('selectedBgm',selectedBgm);
        localStorage.setItem('volume_value',volume_value);
        if(!levelFlag){
            level = level + 1;
        }
        levelFlag = true;
        localStorage.setItem('level',level);
        location.href = "level.html";
    }
}

function drawHealthBar() {
     
    ctx.drawImage(imgLife,565,367,35,24);
    if (life === 1){
        ctx.drawImage(imgHealthBar, 65, 63, 344, 1278, 570, 392, 24, 88);
    }
    if (life === 2){
        ctx.drawImage(imgHealthBar, 550, 63, 344, 1278, 570, 392, 24, 88);
    }
    if (life === 3){
        ctx.drawImage(imgHealthBar, 1034, 63, 344, 1278, 570, 392, 24, 88);
    }
    if (life === 4){
        ctx.drawImage(imgHealthBar, 1516, 63, 344, 1278, 570, 392, 24, 88);
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width - 100, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle(); //추락했을 경우 init setBall 출력
    move();
    drawHealthBar();
    collisionDetection();
    groupItem();
    nextstage();


    if (itemType > 0) {
        itemEffect();
    }
    gameMove = requestAnimationFrame(draw);

    if(gameOn_Off == false) //한번 죽으면 멈춤, 다시 움직이면 실행
    {
        cancelAnimationFrame(gameMove);
        before_excution();
    }
}

function move() {
    if (x + dx > canvas.width - 100 - ballRadius ||
        x + dx < ballRadius) { //좌우 벽, 공의 다음x 위치가 반지름보다 작을 경우
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        //윗 벽, 다음 위치가 반지름보다 작을 경우
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) { //공이 바닥이지만, 바에 맞을 경우
            for (let i = 0; i < 7; i++) {
                if (x > (paddleX + paddleWidth) * i / 7 && x < (paddleX + paddleWidth) * (i + 1) / 7) {

                    dx = dx + dx * Math.abs((0.05 * (3 - i)) - 0.05);
                    // 속도 * 1.10 1.05 1.00 0.95 1.00 1.05 1.10
                    break;
                }
            }
            dy = -dy;

        } else { // 공이 나갈 경우
            life--;
            init();
            //cancelAnimationFrame(gameMove); 
            gameOn_Off = false;
        }
    }
    x += dx; //벽, 바닥 충돌 없을경우 일반 이동
    y += dy;

    if (rightPressed && paddleX < canvas.width - 100 - paddleWidth) { //paddle 동작
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
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e){
    let relativeX = e.clientX - ($(window).width() - canvas.width)/2;
    

    if(gameOn_Off == false || settingOn_Off == true)
    {
        return;
    }
      
    if( relativeX > paddleWidth/2 && relativeX < canvas.width - (100 + paddleWidth/2)) { // 오른쪽을 막는다. 
        paddleX = relativeX  - paddleWidth/2
    }
    
}

document.onmousemove = function(e){
    cursorX = e.screenX;
    cursorY = e.screenY;
}

function init() {
    //바닥 맞았을 경우 game over 판정 및 위치 초기화 함수
    if (life == 0) {
        localStorage.setItem('life', life);
        localStorage.setItem('score', score); /* 점수를 end.js로 전달 */
        location.href = 'end.html';
    }
    setBall();
    setPaddle();
}

function setBall() { //공위치, 속도 초기화
    x = (canvas.width - 100) / 2;
    y = canvas.height - 30;
    dx = 1 * 2;
    dy = -1 * 2;
    ballRadius = 10;
}

function setPaddle() { //패들 위치, 크기, 속도 초기화
    paddleWidth = 120;
    paddleX = (canvas.width - 100 - paddleWidth) / 2;
    paddledx = 7;
}


function draw_object() { //게임을 시작하면 바로 실행되지 않고 오브젝트들을 그리기만 한후 move함수 실행 x;
    ctx.clearRect(0, 0, canvas.width - 100, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle(); 

    requestAnimationFrame(draw_object);
}
draw_object();

function mousedown_toMove(e) { //게임 시작후 정지화면에서 마우스 좌클릭을 하면 게임 실행
    if(settingOn_Off == true)
    {
        return;
    }

    let relativeX = e.clientX - ($(window).width() - canvas.width)/2;

    console.log(relativeX);

    if(relativeX >=0 && relativeX <= 500)
    {
        game_start_move();
    }

}
function keydown_toMove(e) { //게임 시작후 정지화면에서 좌우 방향키를 누르면 게임 실행
    if(settingOn_Off == true)
    {
        return;
    }
    if (e.key == "Left" || e.key == "ArrowLeft") //게임 시작후 왼쪽키를 누르면 왼쪽으로 튕겨 나감
    {
        dx = -1 * 2;
    }
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "Left" || e.key == "ArrowLeft") {
        game_start_move();
    }
}
function game_start_move()
{
    $("#start-info").hide();
    gameOn_Off = true;
    draw();
    bgmStart(selectedBgm);
    document.removeEventListener('mousedown', mousedown_toMove); //한번 실행 후 이벤트리스너 삭제
    document.removeEventListener('keydown', keydown_toMove); //한번 실행 후 이벤트리스너 삭제
}

function before_excution() {
    document.addEventListener('mousedown', mousedown_toMove);
    document.addEventListener('keydown', keydown_toMove);
};
before_excution();

ctx.beginPath();
ctx.moveTo(500, 0);
ctx.lineTo(500, 500);
ctx.stroke();


function drawSideBar(){
    ctx.fillStyle = "#070719";
    ctx.fillRect(500,0,100,500);   
}

drawSideBar();

function checkLife() {
    localStorage.setItem('life', life);
}

setInterval(checkLife, 50);
//draw();
