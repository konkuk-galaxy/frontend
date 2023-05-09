

const showGameResult = (score, win) => {
  const _score = $("#score").val();
  $("span#score").text(_score);
}

const endGame = () => {
  window.close();
}
