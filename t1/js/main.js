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
    if (snakeArr[0].x+snakeDirection[0]==snakeArr[1].x && snakeArr[0].y+snakeDirection[1]==snakeArr[1].y)
    {snakeDirection[0]=-snakeDirection[0];snakeDirection[1]=-snakeDirection[1];}
})

//蛇根据snakeDirection方向前进
function snakeMove(){
    
    if(knockCheck()==-1){
        return;
    }
    getFood();
    mapArr[snakeArr[snakeArr.length-1].x][snakeArr[snakeArr.length-1].y].snake=0;
    
    //经典模式
    if(knockCheck()==0){
        
        //根据蛇尾部的坐标将地图相应坐标的snake属性值置为0，将前进方向上下一格的地图坐标snake属性值设为1
        mapArr[snakeArr[0].x+snakeDirection[0]][snakeArr[0].y+snakeDirection[1]].snake=1;
        //蛇数组
        snakeArr[snakeArr.length-1].x=snakeArr[0].x+snakeDirection[0];
        snakeArr[snakeArr.length-1].y=snakeArr[0].y+snakeDirection[1];
    }
    
    //轻松模式
    else if(knockCheck()==1){
        //蛇数组
        if( snakeArr[0].x+snakeDirection[0]>29||snakeArr[0].x+snakeDirection[0]<0){
            snakeArr[snakeArr.length-1].x=mapW-1-snakeArr[0].x;
            snakeArr[snakeArr.length-1].y=snakeArr[0].y;
            
            if( mapArr[mapW-1-snakeArr[0].x][snakeArr[0].y].snake == 1)
            {
                bite(mapW-1-snakeArr[0].x,snakeArr[0].y);
            }
            mapArr[mapW-1-snakeArr[0].x][snakeArr[0].y].snake = 1;
        }
        else if(snakeArr[0].y+snakeDirection[1]>29||snakeArr[0].y+snakeDirection[1]<0){
            snakeArr[snakeArr.length-1].y=mapH-1-snakeArr[0].y;
            snakeArr[snakeArr.length-1].x=snakeArr[0].x;

            if( mapArr[snakeArr[0].x][mapH-1-snakeArr[0].y].snake == 1)
            {
                bite(snakeArr[0].x,mapH-1-snakeArr[0].y);
            }
            mapArr[snakeArr[0].x][mapH-1-snakeArr[0].y].snake = 1;
        }   
    }

    snakeArr.unshift(snakeArr.pop());
    $map.html("");
    drawSnake();
}

//判断蛇头是否撞到墙壁或咬到自己
function knockCheck(){
    if( snakeArr[0].x+snakeDirection[0]>29 || snakeArr[0].y+snakeDirection[1]>29 ||
    snakeArr[0].x+snakeDirection[0]<0 || snakeArr[0].y+snakeDirection[1]<0)
        {
        if (hOption=='classic'){
            gameOver();
            return -1;
        }
        else if(hOption=="easy"){
            return 1;
        }
    }
    else if(mapArr[snakeArr[0].x+snakeDirection[0]][snakeArr[0].y+snakeDirection[1]].snake==1)
    {
         if (hOption=='classic'){
            gameOver();
            return -1;
         }
         else if(hOption=="easy"){
            bite(snakeArr[0].x+snakeDirection[0],snakeArr[0].y+snakeDirection[1]);
        }
    }
    return 0;
}

//bite
function bite(tX,tY){
    for(let i =0;i<snakeArr.length-1;i++){
        if(snakeArr[i].x==tX && snakeArr[i].y==tY)
        {
            for(let j=i;j<snakeArr.length;j++)
            {
                snakeArr.length--;
                mapArr[snakeArr[snakeArr.length-1].x][snakeArr[snakeArr.length-1].y].snake=0;
            }
            s1.play();
        }
    }
}


//判断是否吃到食物
function getFood(){
    if ( (snakeArr[0].x+snakeDirection[0]==foodX && snakeArr[0].y+snakeDirection[1]==foodY) ||
        (snakeArr[0].x==foodX && snakeArr[0].y==foodY)){
        mapArr[foodX][foodY].food=0;
        snakeArr.push({x: snakeArr[snakeArr.length-1].x,y: snakeArr[snakeArr.length-1].y});
        
        if(fType==0){speedUp(80);score(3);}
        else if(fType==1){speedUp(20);score(10);}
        else if(fType==2){speedUp(150);score(1);}
        else if(fType==3){speedUp(40);score(5);}
        produceFood();console.log(snakeArr.length);
    }
}

var s1=document.getElementById("acro");
var $start=$('#start');
var $restart=$('<p>输入回车或鼠标点击重新开始</p>');
//游戏结束
function gameOver(){
    clearInterval(interval);
    s1.play();
    $start.html("重新开始");
    $('body').append($restart);
    $restart.css({"color":"wheat","font-size":"12px", "position":"absolute","top":"48%",
    "left":"50%","transform":"translate(-50%,120%)" });
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

//输入回车
function enterInput(){
    if(event.keyCode=='13'){
        $(document).unbind('keydown',enterInput);
        stuff();
}}

//游戏开始
function stuff(){
    initSnake();
    produceFood();
    $start.hide();
    $restart.remove();
    $('ul').show();
    $('#choice').hide();
    $foodLayer.show();
    interval=setInterval("snakeMove()",speed);
}

//变更当前游戏难度
var hOption='classic';
$('input').click(function(){
    hOption=$('input[name="difficulty"]:checked').val();
})

var interval;var speed=80; var sum=0;
$(function(){
    $('.snakeBody').hide();
    $(document).keydown(enterInput);
    $('#start').click(function(){
        $(document).unbind('keydown',enterInput);
        stuff();
    })
})