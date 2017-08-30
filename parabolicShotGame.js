var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    imageTerrain = new Image(),
    imageBall = new Image(),
    terrain = null,
    connectIsDrawed = true,
    cross = {
        x:200,
        y:200,
        size: 8,
        visible:true
    },
    eventFlag = {
        click: true,
        mouseMove: true
    },
    isCollisions = false;
    lastTime = 0;

var canvasTerrain = document.getElementById('canvasTerrain'),
    ctxTerrain = canvasTerrain.getContext('2d');

var canvasBall = document.getElementById('canvasBall'),
    ctxBall = canvasBall.getContext('2d');

    function Sprite(arg){
        this.left = arg.left || 0;
        this.top = arg.top || 0;
        this.width = arg.width || 0;
        this.height = arg.height || 0;
        this.visible = true;
        this.image = arg.image;
        this.speedY = arg.speedY || 0; //初速度
        this.speedUpY = arg.speedUpY || 0; //加速度
        this.speedX = arg.speedX || 0; //初速度
        this.speedUpX = arg.speedUpX || 0; //加速度
        this.moving = false;
    }

    Sprite.prototype = {
        //ctx指的是选择绘制的画布，默认为ctx。
        paint:function(context){
            var tmpctx = context || ctx;
            //console.log(context);
            tmpctx.save();
            tmpctx.drawImage(this.image, 0, 0, this.image.width, this.image.height,
                this.left, this.top, this.width, this.height);
            tmpctx.restore();
        },

        move: function(){

            this.speedY += this.speedUpY;
            this.top += this.speedY;

            this.speedX += this.speedUpX;
            this.left += this.speedX;

            //碰撞的话停止运动。下面的代码不应该写在这里。
            /*if(hasRectCollision(this, terrain) || this.top >= canvas.height){
                this.moving = false;
                connectIsDrawed = true;
                //eventFlag.mouseMove = true;
            }*/
            //console.log(this);

            //console.log(ball);
            //console.log(ball == this);


        }
    }


    //获得光标在canvas上的位置
    function getCoord(event) {
        var x = event.clientX - canvas.offsetLeft;
        var y = event.clientY - canvas.offsetTop;

        return {
            x: x,
            y: y
        };
    }

    //绑定事件
    canvas.onclick = function(event){

        if(eventFlag.click){
            //console.log(getCoord(event));
            //destroyTerrain(getCoord(event).x, getCoord(event).y);

            //首先计算速度。传入参数为两个坐标
            var speed = calculateSpeed(cross.x, cross.y, ball.left + ball.width/2, ball.top + ball.height/2);
            console.log(speed);

            ball.speedX = speed.x;
            ball.speedY = speed.y;
            ball.moving = true;
            connectIsDrawed = false;
            eventFlag.click = false;
            eventFlag.mouseMove = false;
        }
    }

    var lastMousePos;
    canvas.onmousemove = function(event){
        if(eventFlag.mouseMove){
            lastMousePos = getCoord(event);
            ball.top = lastMousePos.y - ball.height/2;
            ball.left = lastMousePos.x - ball.width/2;

            connectIsDrawed = true;
        }
    }

    imageBall.onload = function (){
        //必须在图片加载后才能使用image对象的属性
        terrain = new Sprite(
            {
                top: canvas.height - imageTerrain.height,
                left: 0,
                width: imageTerrain.width,
                height: imageTerrain.height,
                image: imageTerrain
            }
        );

        //第一个界面
        terrain.paint(ctxTerrain);
        draw();
        //ball.move();

    }

    //计算初速度
    function calculateSpeed(x1, y1, x2, y2){
        var dx = Math.floor((x1 - x2)/5);
        var dy = Math.floor((y1 - y2)/5);
        return {
            x: dx,
            y: dy
        };
    }

    function drawConnect(sprite){
        ctx.save();
        ctx.moveTo(cross.x, cross.y);
        ctx.lineTo(sprite.left + sprite.width/2, sprite.top + sprite.height/2);
        ctx.stroke();
        ctx.restore();
    }

    //绘制十字
    function drawCross(x, y, size){
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y-size);
        ctx.lineTo(x, y+size);
        ctx.moveTo(x-size, y);
        ctx.lineTo(x+size, y);
        ctx.stroke();
        ctx.restore();
    }

    //破坏地形。传入的参数为：x坐标、y坐标、破坏半径
    function destroyTerrain(ctx, x, y, radius){
        var r = radius || 15;
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, false);
        ctx.fill();
        ctx.restore();
    }

    //矩形碰撞检测
    function hasRectCollision(rect1, rect2){
        if(rect1.left < rect2.left + rect2.width &&
            rect1.left + rect1.width > rect2.left &&
            rect1.top < rect2.top + rect2.height &&
            rect1.height + rect1.top > rect2.top){
            return true;
        }else{
            return false;
        }
    }

    var d = document.getElementById("canvasDraw"),
         ctxD = d.getContext("2d");

    //获得碰撞交集矩形的位置和大小
    function getIntersectionRect(rect1, rect2) {
        var rect1Right = rect1.left + rect1.width,
            rect1Bottom = rect1.top + rect1.height,
            rect2Right = rect2.left + rect2.width,
            rect2Bottom = rect2.top + rect2.height;

        var rect3Left = Math.max(rect1.left, rect2.left),
            rect3Top = Math.max(rect1.top, rect2.top),
            rect3Right = Math.min(rect1Right, rect2Right),
            rect3Bottom = Math.min(rect1Bottom, rect2Bottom);

        //测试代码：显示相交矩形的截图。
        ctxD.clearRect(0, 0, d.width, d.height);

        ctxD.drawImage(canvasTerrain, rect3Left, rect3Top, rect3Right - rect3Left, rect3Bottom - rect3Top , 0, 0, (rect3Right - rect3Left)*10, (rect3Bottom - rect3Top)*10 );
        ctxD.drawImage(canvasBall, rect3Left, rect3Top, rect3Right - rect3Left, rect3Bottom - rect3Top , 300, 0, (rect3Right - rect3Left)*10, (rect3Bottom - rect3Top)*10 );

        return {
            left: rect3Left,
            top: rect3Top,
            width: rect3Right - rect3Left,
            height: rect3Bottom - rect3Top
        }
    }

    //像素碰撞核心代码
    function handleEgdeCollisions(rect) {
        console.log(rect)
        imgData1 = ctxBall.getImageData(rect.left, rect.top, rect.width, rect.height),
        imgData2 = ctxTerrain.getImageData(rect.left, rect.top, rect.width, rect.height);
        var imgData1Data = imgData1.data;
        var imgData2Data = imgData2.data;
        //console.log(imgData1Data);


        //间隔为4，因为存储的是 RGBA 顺序。只要查找透明度是否大于0就好
        for (var i = 3, len = imgData1Data.length; i < len; i += 4) {
            //console.log(imgData1Data[i]);
            if (imgData1Data[i] > 0 && imgData2Data[i] > 0) {
                console.log('撞了')

                return true;
            }
        }
        return false;
    }

    //计算fps
    function calculateFPS(){
        var now = (+new Date),
            fps = 1000/(now - lastTime);

        lastTime = now;

        return fps;
    }



    var ball = new Sprite(
        {
            top: 100,
            left: 100,
            width: 30,
            height: 30,
            image: imageBall,
            speedY: 0,
            speedUpY: 2
        }
    );

    ctx.font = '32px Helvetica';
    function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //terrain.paint();
        //ctxTerrain.clearRect(0, 0, canvasTerrain.width, canvasTerrain.height);

        //这个只需要画一次。
        // terrain.paint(ctxTerrain);
        ctx.drawImage(canvasTerrain, 0, 0);

        if(cross.visible){
            drawCross(cross.x, cross.y, cross.size);
        }

        if(ball.moving){
            ball.move();
        }

        ball.paint();
        ctxBall.clearRect(0, 0, canvasBall.width, canvasBall.height);
        ball.paint(ctxBall);

        if(connectIsDrawed){
            drawConnect(ball);
        }

        if (hasRectCollision(ball, terrain)) {
            //console.log(this);
            var intersectionRect = getIntersectionRect(ball, terrain);
            //console.log(intersectionRect);
            isCollisions = handleEgdeCollisions(intersectionRect);

        }

        if(isCollisions || ball.top > canvas.height){
            ball.moving = false;
            if(!eventFlag.mouseMove){
                destroyTerrain(ctxTerrain, ball.left + ball.width/2, ball.top + ball.height/2, 40);
            }
            console.log("?")
            ball.left = lastMousePos.x - ball.width/2;
            ball.top = lastMousePos.y - ball.height/2;
            connectIsDrawed = true;
            eventFlag.mouseMove = true;
            eventFlag.click = true;
            isCollisions = false;
        }



        //console.log(hasRectCollision(ball, terrain));
        ctx.fillText(calculateFPS().toFixed(), 45, 50);
        //console.log(calculateFPS().toFixed());
        window.requestAnimationFrame(draw);
    }

    imageTerrain.src =
    "data:image/png;base64,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";
    imageBall.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAC4jAAAuIwF4pT92AAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAHVSURBVHjaxJdNTxNRFEDPnYJl+pEmhJjWdmGotYY2ddfEJc4CTYAdaaBdGOUXGEIV4v/wD0CIRhcu3GFiqGnsig2taRMYVpBiQvhYoC6eCw0RBPqGTKd3+2buuSfv3Ttv5GsKnVDoh+g81Oci8Pw7ch3wdYCOCjC6BO2Yz+gy9NK8hgfQC/MbeBvqPFh5XIDnxqeSRi9se2UMoHoF7jgyz8Q2fj5LhJYE2KWf2/wgp455oI4Y4ld3wFv4eS0xTiJDjGQy5OMJGo067zc22MRkWrW56QCuDf4og+zfCDJbKvHk6TNM02Sv3eZleZ5arUaUCAX13f3D1RKT4WSS6ZkioVAIn89HNBZjqlAAYF1C7p/qn8AxPsLhMIFg8MxaNHYLgD36ne1xvtm5jY8ODwhYFrs7O7RaTXK5+396Qik+ra4CkLybJv+h6e4e+wcGyGazVKtVXpTLlIpF7qRSfFmrsLK8BMCoZTkyFqWU1uSq1+u8WlzgW6Px39rYo8c8n5sjkUhoc7XBALZt8+7tGyprFWx7i3T6HqPWQ8YnJonH446E5S/X63ktvRiZ8m87idd0w+l92A1brz+LctXkEi+glxmLywVoX+jdsr9SoE+zWtd/2n4PALxRfKRM2hx7AAAAAElFTkSuQmCC";
