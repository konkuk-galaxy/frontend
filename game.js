

const showGameResult = (score, win) => {
  const _score = $("#score").val();
  $("span#score").text(_score);
}

const endGame = () => {
  const customWindow = window.open('', '_blank', '');
  customWindow.close();
}
