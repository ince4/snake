const mapW=30,mapH=30,SIZE=20;
var $map=$("#map");
var $foodLayer=$("#foodlayer");
$map.width(mapW*SIZE); $map.height(mapH*SIZE);  
$foodLayer.width(mapW*SIZE); $foodLayer.height(mapH*SIZE);  
var mapArr = new Array();         
   for(let i=0;i<mapW;i++){          
        mapArr[i]=new Array();    
        for(let j=0;j<mapH;j++){      
            mapArr[i][j] = {
            "snake":0,"food":"0","border":"0"
        }
    }
};

var snakeArr=[];
//绘制蛇身位置
function drawSnake(){
    for(let i=0;i<snakeArr.length;i++){
        let $snakeBody=$('<div></div>');
        $snakeBody.addClass("snakeBody");  
        $snakeBody.css({'top':snakeArr[i].y*SIZE+'px', 'left':snakeArr[i].x*SIZE+'px',
        'width':SIZE, 'height':SIZE});
        $map.append($snakeBody);
    };
}

//设置初始状态蛇身
function initSnake(){
    snakeArr.length=3;
    $map.html();
    snakeDirection=[right,0];
    speed=80;
    sum=0;
    $display.html(sum);
    snakeArr[0]={x:5,y:4}; 
    snakeArr[1]={x:4,y:4};
    snakeArr[2]={x:3,y:4};
    mapArr[5][4].snake=1;
    mapArr[4][4].snake=1;
    mapArr[3][4].snake=1;
    drawSnake();
}

var foodX;
var foodY;
var fType;
//生成食物
function produceFood(){
     foodX=Math.floor(Math.random()*mapW);
     foodY=Math.floor(Math.random()*mapH);
    while(mapArr[foodX][foodY].snake==1){
        foodX=Math.floor(Math.random()*(mapW-1));
        foodY=Math.floor(Math.random()*(mapH-1));
    }
    
    mapArr[foodX][foodY].food=1;
    fType=Math.floor(Math.random()*4);
    let foodNum=fType*SIZE+'px '+0+'px';
    let $newFood=$('<div></div>');
    $newFood.addClass("food");  
    $newFood.css({'top':foodY*SIZE+'px', 'left':foodX*SIZE+'px', 'background-image':'url(img/food.gif)',
    'background-position':foodNum, 'width':SIZE, 'height':SIZE});
    $foodLayer.html($newFood);
}

const left=up=-1,right=down=1;
var snakeDirection=[right,0];
//键盘事件控制蛇头方向
$(document).on("keydown",function(event){
    
    switch(event.keyCode){
        case 37:
        if (snakeDirection[0] != right){
            snakeDirection=[left,0];
        }break;
        case 38:
        if (snakeDirection[1] != down){
            snakeDirection=[0,up];
        }break;
        case 39:
        if (snakeDirection[0] != left){
            snakeDirection=[right,0];
        }break;
        case 40:
        if (snakeDirection[1] != up){
            snakeDirection=[0,down];
        }break;
    }

})

//蛇根据snakeDirection方向前进
function snakeMove(){
    if(knockCheck()==1){
        return;
    }
    getFood();
    mapArr[snakeArr[snakeArr.length-1].x][snakeArr[snakeArr.length-1].y].snake=0;
    mapArr[snakeArr[0].x+snakeDirection[0]][snakeArr[0].y+snakeDirection[1]].snake=1;
    snakeArr[snakeArr.length-1].x=snakeArr[0].x+snakeDirection[0];
    snakeArr[snakeArr.length-1].y=snakeArr[0].y+snakeDirection[1];
    snakeArr.unshift(snakeArr.pop());
    $map.html("");
    drawSnake();
}

//判断蛇头是否撞到墙壁或咬到自己
function knockCheck(){
    if (snakeArr[0].x+snakeDirection[0]==snakeArr[1].x && snakeArr[0].y+snakeDirection[1]==snakeArr[1].y)
    {snakeDirection[0]=-snakeDirection[0];snakeDirection[1]=-snakeDirection[1];
    }
    else if( snakeArr[0].x+snakeDirection[0]>29 || snakeArr[0].y+snakeDirection[1]>29 ||
        snakeArr[0].x+snakeDirection[0]<0 || snakeArr[0].y+snakeDirection[1]<0){
        gameOver();
        return 1;
    }
    else if(mapArr[snakeArr[0].x+snakeDirection[0]][snakeArr[0].y+snakeDirection[1]].snake==1){
        gameOver();
        return 1;
    }
}

//判断是否吃到食物
function getFood(){
    if (snakeArr[0].x+snakeDirection[0]==foodX && snakeArr[0].y+snakeDirection[1]==foodY){
        mapArr[foodX][foodY].food=0;
        snakeArr.push({x: snakeArr[snakeArr.length-1].x,y: snakeArr[snakeArr.length-1].y});
        
        if(fType==0){speedUp(80);score(3);}
        else if(fType==1){speedUp(20);score(10);}
        else if(fType==2){speedUp(150);score(1);}
        else if(fType==3){speedUp(40);score(5);}
        produceFood();
    }
}

var s1=document.getElementById("acro");
var $start=$('#start');
//游戏结束
function gameOver(){
    clearInterval(interval);
    s1.play();
    $start.html("重新开始");
    $start.show();
    for(let i=0;i<snakeArr.length;i++){
        mapArr[snakeArr[i].x][snakeArr[i].y].snake=0;
    }
    mapArr[foodX][foodY].food=0;
    $(document).keydown(enterInput);
}

//提速
function speedUp(newSpeed){
 speed=newSpeed;
 clearInterval(interval);
 interval=setInterval("snakeMove()",speed);
}

var $display=$('li').eq(1);
var s2=document.getElementById("getpoint");
//得分
function score(n){
    s2.play();
    sum+=n;
    $display.html(sum);
}

function enterInput(){
    if(event.keyCode=='13'){
        $(document).unbind('keydown',enterInput);
        stuff();
}}

function stuff(){
    initSnake();
    produceFood();
    $start.hide();
    $('ul').show();
    $foodLayer.show();
    interval=setInterval("snakeMove()",speed);
}

var interval;var speed=80; var sum=0;
$(function(){
    $('.snakeBody').hide();

    $(document).keydown(enterInput);

    $('#start').click(function(){
        $(document).unbind('keydown',enterInput);
        stuff();
    })
    

})