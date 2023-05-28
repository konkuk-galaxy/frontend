var index = 0;
var difficulty = localStorage.getItem('difficulty');

$(document).ready(function() {

$("#btn").click(function() {
    
    if(index == 0)
    {
        $("#textp").html("<br>탐사작업에 대한 설명은 내가 할걸세.<br>")
    }
    else if(index == 1)
    {
        $("img").attr("src", "tutorial/960x540image2.png");
        $("#textp").html("<br>먼저 저기 위에 벽돌들이 보이나? 우리가 탐사해야 할 곳들이지.<br>")
    }
    else if(index == 2)
    {
        $("img").attr("src", "tutorial/960x540image3.png");
        $("#textp").html("<br>공이 벽돌에 부딪힌다면 지역 탐사가 완료되네.<br>")
    }

    else if(index == 3)
    {
        $("img").attr("src", "tutorial/960x540image4.png");
        $("#textp").html("<br>탐사가 완료되면 무슨 일이 일어날지는 모르지.<br>우리는 귀중한 자원을 얻을 수도 있고, 아니면 위험한 운석이나 미확인 지적생명체를 만날 수도 있지.")
    }
    else if(index == 4)
    {
        $("img").attr("src", "tutorial/960x540image5.png");
        $("#textp").html("<br>또한 상황을 변화시키는 여러 아이템이 나올수도 있을거야. 예를 들어 아래 바의 크기가 커지거나 작아질수도 있고<br>공의 속도나 이동방향이 바뀔지도 모르지. 아이템은 도움이 될수도, 안될수도 있네.")
    }
    else if(index == 5) 
    {
        $("img").attr("src", "tutorial/960x540image1.png");
        $("#textp").html("<br>목표는 자원수집이네. [미정]점을 넘기게! 점수는 자원 획득으로 얻을 수 있고 각 자원별로 점수가 다르다는 것을 참고하게!<br>")
        $("#buttonp").html("알겠습니다!")
    }
    else
    {
        if(difficulty == 1)
        location.href="level1.html"
        else if(difficulty == 2)
        location.href="level2.html"
        else
        location.href="level3.html"
    }
index = index + 1
});

});