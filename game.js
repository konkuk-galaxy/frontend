

const showGameResult = (score, win) => {
  const _score = $("#score").val();
  $("span#score").text(_score);
}

// 종료 함수 조금 더 협의 필요
const endGame = () => {
  const customWindow = window.open('', '_blank', '');
  customWindow.close();
}


sscore=0;


function printscore(j){/*game ver.commit 1.js에서 score를 받아서 print하는 함수*/
  sscore=localStorage.getItem('score')
  j.text(sscore);
}

$(document).ready(function(){/*점수를 print*/
  printscore($("#score"));
});