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
