

const showGameResult = (score, win) => {
  const _score = $("#score").val();
  $("span#score").text(_score);
}

// 종료 함수 조금 더 협의 필요
const endGame = () => {
  const customWindow = window.open('', '_blank', '');
  customWindow.close();
}

/* game ver.commit 1.js에서 score를 받아서 print하는 함수*/
$("#score").text(localStorage.getItem('score'));
