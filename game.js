

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

let score1=0;
let score2=0;
let score3=0;
if(localStorage.getItem('score1')!=null){
  score1=localStorage.getItem('score1');
}
if(localStorage.getItem('score2')!=null){
  score2=localStorage.getItem('score2');
}
if(localStorage.getItem('score3')!=null){
  score3=localStorage.getItem('score3');
}
let total=parseInt(score1)+parseInt(score2)+parseInt(score3);
$("#score").text(total);