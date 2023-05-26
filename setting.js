const backgroundUrl = ["url('background/space-g52a222904_1920.jpg')",
 "url('background/space-g10131bb9e_1920.jpg')",
 "url('background/stars-g5d44ea9a5_1920.jpg')"];

const color = [
    "red", "orange", "yellow", "lime", "green", "blue", "aqua", "purple", "black", 
    "gray", "aliceblue", "blueviolet", "brown", "navy"
];


let level_info;
let ballColor = color[10];  //공 색상 정보 저장
let blockColor = color[10];  //블럭 색상 정보 저장
let background_IMg = backgroundUrl[0];  //배경 이미지 정보 저장
let selectedBgm = "bgm1"; //선택된 bgm을 저장
let volume_value = 5;


let blockContext;  //설정에서의 블럭 예시창
let ballContext;   //설정에서의 공 예시창

let volumeTmp;  //볼륨정보 임시 저장

let url_values_arr = []; //url에서 넘겨받은 정보 저장
let i = 0;
//const urlParams = new URLSearchParams(window.location.search); 
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




$(function(){
    

    createBackgroundTable();  //설정에서 배경이미지 테이블 생성
    createColorTable($("#blockColorTable"), "blockColorList");   //설정에서 블럭 색상 테이블 생성
    createColorTable($("#ballColorTable"), "ballColorList");   //설정에서 공 색상 테이블 생성
    ballColorShowCanvas();   //설정에서 공 예시 그리기
    blockColorShowCanvas();   //설정에서 블럭 예시 그리기
    

    $("body").css("background-image",background_IMg);
    $("#select-bgm").val(selectedBgm).prop("selected", true);
    //$("#"+volume_value).prop("selected", true);



    // $("#volume-bar").val(volume_value).trigger("input");
    if(volume_value == 0)  //전달받은 볼륨정보로 볼륨 설정
    {
       $("#speakerImg").attr("src", "etc/speaker_off.jpg")
    }
    else
    {
        $("#speakerImg").attr("src", "etc/speaker_on.jpg")
    }
    $("#volume-bar").prop("value", volume_value);
    $("audio").prop("volume", volume_value/10);
    $("#vol_val").text(volume_value);
    
    //level select 클릭시 레벨선택 팝업 띄움
    $("#level-select").on ("click", function() {
        close_allPopup();
		$("#level-popup").addClass("popup");
		change_position($(".popup"));
		$("#level-popup").show();
	})

    //설정 이미지 클릭시 설정팝업을 띄움
    $("#setting-img").on ("click", function() {
        openSettingPopup();
	})

    
    //팝업에서 x이미지는 클릭하면 팝업을 닫음
    $(".close-img").on ("click", function() {
        if(gameOn_Off == true)
            requestAnimationFrame(draw);
        $(this).parent().hide();
		$(this).parent().removeClass("popup");
	})
    
    //설정에서 배경이미지를 선택하면 성택한 배경으로 변경
    $(".backgroundList").on ("click", function() {
        let str = $(this).css("background-image");
        background_IMg = str;
        $("body").css("background-image",background_IMg);
    })

    //설정에서 블럭 색상을 선택하면 선택한 색상으로 변경
    $(".blockColorList").on ("click", function() {
        let str = $(this).css("background-color");
        blockColor = str;
        drawExBlock(blockColor);
    })

    //설정에서 공 색상을 선택하면 선택한 색상으로 변경
    $(".ballColorList").on ("click", function() {
        let str = $(this).css("background-color");
        ballColor = str;
        drawExBall(ballColor);
    })

    //bgm을 선택하면 선택한 bgm으로 변경
    $("#select-bgm").on ("change", function() {
        if(gameOn_Off == false)
        {
            selectedBgm = $("#select-bgm option:selected").val();
            return;
        }
        selectedBgm = $("#select-bgm option:selected").val();
        initAllBgm();
        bgmStart(selectedBgm);
    })

    //볼륨바를 조정하면 값에따라 음량을 조절
    $("#volume-bar").on ("input", function() {
        volume_value = $(this).val();
        const vol = volume_value / 10;

        if(vol == 0)
        {
            $("#speakerImg").attr("src", "etc/speaker_off.jpg")
        }
        else
        {
            $("#speakerImg").attr("src", "etc/speaker_on.jpg")
        }
        //$("audio").volume = vol;
        $("audio").prop("volume", vol);
        $("#vol_val").text(volume_value);
    })

    //스피커 이미지 선택시 볼륨 0으로, 다시 누르면 원래 볼륨으로
    $("#speakerImg").on ("click", function() {
        if (volume_value == 0) {
            $("#volume-bar").val(volumeTmp).trigger("input");
            volume_value = volumeTmp;
            return;
        }

        volumeTmp = volume_value;
        volume_value = 0;
        $("#volume-bar").val(volume_value).trigger("input");
	})

    //키보드에서 esc를 누르면 세팅팝업을 띄움
    document.addEventListener('keydown', (event) => {
        if(event.key === 'Escape')
        {
            openSettingPopup();
        }
    });

    //exit을 클릭하면 창을 닫음
    $("#game-exit").on("click", function() {
        window.close();
    })

    //다시시작 버튼을 클릭하면 스테이지 다시 시작, 수정한 정보들을 가지고 다시 페이지를 로드함
    $("#restart-btn").on ("click", function() {
        let values_str="?";
        values_str = values_str + "level_info=" + level_info;
        values_str = values_str + "&ballColor=" + ballColor;
        values_str = values_str + "&blockColor=" + blockColor;
        values_str = values_str + "&background_IMg=" + background_IMg;
        values_str = values_str + "&selectedBgm=" + selectedBgm;
        values_str = values_str + "&volume_value=" + volume_value;
        if (level_info == 1) {
            location.href = 'level1.html' + values_str;
        }
        else if (level_info == 2) {
            location.href = 'level2.html' + values_str;
        }
        else if (level_info == 3) {
            location.href = 'level3.html' + values_str;
        }
        else if (level_info == 4) {
            location.href = 'end.html' + values_str;
        }
    })

})

function openSettingPopup()
{
    if($("#setting-popup").attr("class") == "popup") //이미 세팅창이 열려있을경우
    {
        $(".close-img").trigger("click");
        return;
    }

    //세팅창이 열려있지 않을경우
    cancelAnimationFrame(gameMove);
    close_allPopup();
	$("#setting-popup").addClass("popup");
	change_position($(".popup"));
	$("#setting-popup").show();
}

function close_allPopup() {
    $(".popup").hide();
    $(".popup").removeClass("popup");
}

function change_position(e) {
	let l = ($("body").width() - e.width())/2;
	let t = ($("body").height() - e.height())/2;
	e.css({top:t, left:l});
}



function createBackgroundTable()
{
    let i;
	for(i = 0; i < backgroundUrl.length; i++)
	{
        let new_div = $("<div>");
        new_div.addClass("backgroundList");
        new_div.css("background-image",backgroundUrl[i]);
        new_div.css("background-size","100% 100%");
        new_div.css({"display":"inline-block","width":"160px","height":"90px"});
        $("#backgroundImgTable").append(new_div);
		
	}
}

function createColorTable(obj, className)
{
    let i;
	for(i = 0; i < color.length; i++)
	{
        let new_div = $("<div>");
        new_div.addClass(className);
        new_div.css("background-color",color[i]);
        new_div.css({"display":"inline-block","width":"64px","height":"48px"});
        $(obj).append(new_div);
	}
}


function ballColorShowCanvas() 
{
	ballContext=document.getElementById("ballColorShow").getContext("2d");
	drawExBall(ballColor);
}

function drawExBall(color_info) {
	ballContext.clearRect(0,0,100,100);
	ballContext.beginPath();
	ballContext.arc(50,50,10,0,2.0*Math.PI, true);
	ballContext.fillStyle = color_info;
	ballContext.fill();
}

function blockColorShowCanvas()
{
    blockContext=document.getElementById("blockColorShow").getContext("2d");
    drawExBlock(blockColor);
}

function drawExBlock(color) {
	blockContext.clearRect(0,0,100,100);
	blockContext.beginPath();
    blockContext.roundRect(20,45,60,10,2);
    blockContext.fillStyle = color;
    blockContext.fill();
}

function bgmStart(bgm) {
    if(bgm == "none")
        return;
    document.getElementById(bgm).play();
}

function initAllBgm() {
    let i;
    let all_bgm = document.getElementsByClassName("allBgm");
    for(i=0 ; i < all_bgm.length; i++)
    {
        all_bgm[i].currentTime = 0;
        all_bgm[i].pause();
    }
}
