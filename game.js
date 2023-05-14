

const showGameResult = (score, win) => {
  const _score = $("#score").val();
  $("span#score").text(_score);
}

// 종료 함수 조금 더 협의 필요
const endGame = () => {
  const customWindow = window.open('', '_blank', '');
  customWindow.close();
}
