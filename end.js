let level_info = 1;
let ballColor = "aliceblue";  //공 색상 정보 저장
let blockColor = "aliceblue";  //블럭 색상 정보 저장
let background_IMg = "url('background/space-g52a222904_1920.jpg')";  //배경 이미지 정보 저장
let selectedBgm = "bgm1"; //선택된 bgm을 저장
let volume_value = 5;

let url_values_arr = []; //url에서 넘겨받은 정보 저장
let i = 0;

const url = new URL(window.location.href);
const urlParams = url.searchParams; 

const values = urlParams.values();

for(const val of values)  {
    url_values_arr[i] = val;
    console.log(url_values_arr[i]);
    i++;
    if(i == 6)
        break;
}
if(url_values_arr[0] != null)
{
    level_info = url_values_arr[0];
}
if(url_values_arr[1] != null && url_values_arr[5] != null)
{
    ballColor = url_values_arr[1];
    blockColor = url_values_arr[2];
    background_IMg = url_values_arr[3];
    selectedBgm = url_values_arr[4];
    volume_value = url_values_arr[5];
}

$("#toMenu-btn").on ("click", function() {
  console.log("메뉴료 이동");
  level_info = 0;
  let values_str="?";
  values_str = values_str + "level_info=" + level_info;
  values_str = values_str + "&ballColor=" + ballColor;
  values_str = values_str + "&blockColor=" + blockColor;
  values_str = values_str + "&background_IMg=" + background_IMg;
  values_str = values_str + "&selectedBgm=" + selectedBgm;
  values_str = values_str + "&volume_value=" + volume_value;
  location.href = 'main.html' + values_str;
})



const showGameResult = (score, win) => {
  const _score = $("#score").val();
  $("span#score").text(_score);
}

/* life 값이 0이면 패배한 결과를 출력 */
if (localStorage.getItem('life') === '0') {
  $("#winorlose p").text('Lose...');
  $("#winorlose").css("color", "#8b00ff")
}

/* game ver.commit 1.js에서 score를 받아서 print하는 함수*/


if (localStorage.getItem('score') != null) {
  score = localStorage.getItem('score');
}

let total = parseInt(score);
$("#score").text(total);
