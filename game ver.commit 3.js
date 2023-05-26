//patch 1 : 벽돌 / 공 / 바 그리기,  충돌 감지, 공-벽, 공-블록, 공-바, 공-바닥 상호작용, 키보드 동작, 목숨 3개 및 end.html로 이동

//patch 2 : html body에 p 태그 #col,row에서 행렬 개수 가져옴, 블록을 다 깼을 시 다음 단계로 넘어, 3단계 까지 갔을경우 end로 이동

//patch 3 : angle-item & game ver.commit2 통합, 벽돌 충돌 판정 부분을 넓힘(공 이동속도가 바뀌면서 블록을 통과하는 오류를 제거),  slow 이미지 달팽이 추가, paddle 맞을때 공이 역주행 하는 버그 패치, paddle 충돌 시 속도 처리방식 변경 

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
imgItem_meteor.src = "img/item_meteor.jpg"

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
            }
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function arrangeItem() {
    if (breakBrick > 0 && itemUse < 1) {
        randomValue = getRandomInt(1, 1000);
        itemType = Math.floor((randomValue - 1) / 100) + 1;
        itemUse++;
        breakBrick = 0;
    }
    if (breakBrick > 3) {
        randomValue = getRandomInt(1, 1000);
        itemType = Math.floor((randomValue - 1) / 100) + 1;
        itemUse++;
        breakBrick = 0;
    }
} // 아이템 랜덤 배분 itemType 1~10까지, 깨질때마다 랜덤하게 배분 

function drawItem() { //
    if (itemLogY < 490 && itemLogX === 501) {
        itemLogY = 20;
        itemLogY += (itemCnt * 25);
    }
    if (itemLogY > 490) { // 아이템 아이콘 줄바꿈
        itemLogX = 527;
        itemLogY = itemLogY + (itemCnt * 25) - 475;
    }
    if (itemLogY < 490 && itemLogX === 527) { // 아이템 아이콘 둘째줄
        itemLogY = itemLogY + (itemCnt * 25) - 475;
    }
}
function itemEffect() {
    if (itemPosX === 0 && itemPosY === 0) {
        itemPosX = x - 20;
        itemPosY = y;
    }
    itemPosY += 5;
    if (itemType === 1) { // 목숨을 늘려주는 아이템
        life++;
        ctx.drawImage(imgItem_heart, itemLogX, itemLogY, 24, 24);
        itemCnt++;
        drawItem();
        itemType = 0;
        itemUse = 0;
        itemPosY = 10000;
    }
    if (itemType === 2) { // 공 속도 변화

        dx = dx * 1.35;
        dy = dy * 1.35;

        ctx.drawImage(imgItem_speed, itemLogX, itemLogY, 24, 24);
        itemCnt++;
        drawItem();
        itemType = 0;
        itemUse = 0;
        itemPosY = 10000;

    }
    if (itemType === 3) { // 패들 크기 변화
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
        itemPosY = 10000;
    }
    if (itemType === 4) { // 공 느리게
        dy = dy / 1.35;
        dx = dx / 1.35;
        ctx.drawImage(imgItem_ball, itemLogX, itemLogY, 24, 24);
        itemCnt++;
        drawItem();
        itemType = 0;
        itemUse = 0;
        itemPosY = 10000;
    }
    if (itemType === 5) { // 유성
        ctx.drawImage(imgItem_meteor, itemPosX, itemPosY, 24, 24);
        if (itemPosX > paddleX && itemPosX < paddleX + paddleWidth && itemPosY > canvas.height - 36 && itemPosY < canvas.height) {
            life--;
            itemType = 0;
            itemUse = 0;
            itemPosY = 10000;
        }
        if (itemPosX < paddleX && itemPosX > paddleX + paddleWidth && itemPosY > canvas.height - 36 && itemPosY < canvas.height) {
            itemType = 0;
            itemUse = 0;
            itemPosY = 10000;
        }
        itemUse = 0;
    }
    if (itemType === 6 || itemType === 7) { // 자원
        randomValue2 = getRandomInt(1, 1000);
        jewelType = Math.floor((randomValue2 - 1) / 200) + 1;
        if (jewelType === 1) {
            ctx.drawImage(imgItem_diamond, itemLogX, itemLogY, 24, 24);
            itemCnt++;
            drawItem();
        }
        if (jewelType === 2) {
            ctx.drawImage(imgItem_saphire, itemLogX, itemLogY, 24, 24);
            itemCnt++;
            drawItem();
        }
        if (jewelType === 3) {
            ctx.drawImage(imgItem_ruby, itemLogX, itemLogY, 24, 24);
            itemCnt++;
            drawItem();
        }
        if (jewelType === 4) {
            ctx.drawImage(imgItem_gas, itemLogX, itemLogY, 24, 24);
            itemCnt++;
            drawItem();
        }
        if (jewelType === 5) {
            ctx.drawImage(imgItem_mineral, itemLogX, itemLogY, 24, 24);
            itemCnt++;
            drawItem();
        }
        itemType = 0;
        itemUse = 0;
        jewelType = 0;
    }
    if (itemType === 8 || itemType === 9 || itemType === 10) { // 꽝
        itemType = 0;
        itemUse = 0;
    }
    if (itemPosY > canvas.height) {
        itemPosX = 0;
        itemPosY = 0;
        itemType = 0;
    }
}

function nextstage() { //다음 level 이동
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

        //url주소를 받아와 레벨을 파악하는 방식이 아닌 주소에 레벨을 비롯한 색상, 배경등의 정보를 함께 넘겨 줘서 그 정보를 바탕으로 현제 레벨을 파악함.
        //다음스테이지로 넘어갈때 레벨, 색상, 배경, bgm정보등을 url 주소에 포함시켜 넘겨줘야함
        level_info++;  
        let values_str="?";   
        values_str = values_str + "level_info=" + level_info;     //
        values_str = values_str + "&ballColor=" + ballColor;
        values_str = values_str + "&blockColor=" + blockColor;
        values_str = values_str + "&background_IMg=" + background_IMg;
        values_str = values_str + "&selectedBgm=" + selectedBgm;
        values_str = values_str + "&volume_value=" + volume_value;
        if (level_info == 2) {
            location.href = 'level2.html' + values_str;
        }
        else if (level_info == 3) {
            location.href = 'level3.html' + values_str;
        }
        else if (level_info == 4) {
            location.href = 'end.html' + values_str;
        }
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width - 100, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle(); //추락했을 경우 init setBall 출력
    move();
    collisionDetection();
    arrangeItem();
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
                    //2가지 방식으로 개선
                    //가속만 하면 후에 dx가 너무 빨라져 감속 추가

                    //dx = dx + (0.05 * (3 - i))-0.05; 
                    //변화 : +0.10 +0.05 0.00 -0.05 0.00 +0.05 +0.10

                    dx = dx + dx * Math.abs((0.05 * (3 - i)) - 0.05);
                    // 속도 * 1.10 1.05 1.00 0.95 1.00 1.05 1.10
                    break;


                    // 이전 패치 : 1.15, 1.10, 1.05, 1.00, 1.05, 1.10, 1.15배 x증가폭 변경
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


function init() {
    //바닥 맞았을 경우 game over 판정 및 위치 초기화 함수
    if (life == 0) {
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
    paddleX = (canvas.width - 100 - paddleWidth) / 2;
    paddleWidth = 120;
    paddledx = 7;
}

//draw();

////////////////////////////////////////////


function draw_object() { //게임을 시작하면 바로 실행되지 않고 오브젝트들을 그리기만 한후 move함수 실행 x;
    ctx.clearRect(0, 0, canvas.width - 100, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle(); 
    //move();
    collisionDetection();
    arrangeItem();
    nextstage();

    requestAnimationFrame(draw_object);
}
draw_object();

function before_excution() {
    document.addEventListener('keydown', function T(e) { //게임 시작후 정지화면에서 좌우 방향키를 누르면 게임 실행
        if($("#setting-popup").attr("class") == "popup")
        {
            return;
        }
        if (e.key == "Left" || e.key == "ArrowLeft") //게임 시작후 왼쪽키를 누르면 왼쪽으로 튕겨 나감
        {
            dx = -1 * 2;
        }
        if (e.key == "Right" || e.key == "ArrowRight" || e.key == "Left" || e.key == "ArrowLeft") {
            $("#start-info").hide();
            gameOn_Off = true;
            draw();
            bgmStart(selectedBgm);
            document.removeEventListener('keydown', T); //한번 실행 후 이벤트리스너 삭제
        }
    });
};
before_excution();

ctx.beginPath();
ctx.moveTo(500, 0);
ctx.lineTo(500, 500);
ctx.stroke();
function Neexxtt() 
{
    level_info++;
    let values_str="?";
    values_str = values_str + "level_info=" + level_info;
    values_str = values_str + "&ballColor=" + ballColor;
    values_str = values_str + "&blockColor=" + blockColor;
    values_str = values_str + "&background_IMg=" + background_IMg;
    values_str = values_str + "&selectedBgm=" + selectedBgm;
    values_str = values_str + "&volume_value=" + volume_value;
    if (level_info == 2) {
        location.href = 'level2.html' + values_str;
    }
    else if (level_info == 3) {
        location.href = 'level3.html' + values_str;
    }
    else if (level_info == 4) {
        location.href = 'end.html' + values_str;
    }

}