(function () {
    "use strict";

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;
    var gameFragment = ["JZ01game", "MZB02"];//清空游戏区域
    
    //JZ01 Variable
    var JZ01missionKey = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"];//关卡的前缀，用于图片和音频的前缀
    var JZ01AnimationBool = true;//时候可以播放下一个动画
    var question = [];//问题的编号1，格式为a201，可以直接赋值给图片和音频
    var questionNum = [];//问题的编号2，格式为1，2，3，4，5
    var questionFour = [];//阶段2里面的四个图片的编号1
    var rightCount = 0;//目前答对的题数，当为4的时候，切换下一批卡片
    var JZ01score = 100;//目前关卡的总分，采用扣分制度
    var tips = null;//提醒器
    var minus = null;//扣分器
    var jz01Star = [90, 70, 50];//星级分数，0为三星，1为二星，2为一星
    var JZ01CanClick = true;

    var photoObject =
    {
        src: null
    };

    //MZH01
    var gameEngine = false;

    //通用函数
    //返回min~max之间的一个随机数，包括min和max
    function randomFunction(min,max){
        return Math.round(Math.random()*(max-min))+min;
    }
    
    //moduleJZ
    //JZ01
    function createStageOne() {
        $(".JZ01game").css("background", "url('../../images/JZ01/JZ01BG.png') no-repeat")
        var missionID = parseInt((localSettings.values["lastGame"])["missionID"]);//1
        var JZ01 = (localSettings.containers.lookup("moduleJZ")).containers.lookup("JZ01");//the contaier JZ01
        var missionNumber = "";//01字符串
        if (missionID < 10) {
            missionNumber = "0" + missionID;
        } else {
            missionNumber = missionID.toString();
        }
        var mString = "M" + missionNumber;//关卡数M01
        var cardNumber = (JZ01.values[mString])["cardNumber"];
        var cardChinese = ((JZ01.values[mString])["cardChinese"].toString()).split("，");
        var cardPinyin = ((JZ01.values[mString])["cardPinyin"].toString()).split("，");

        $("#ready").css("background", "url('../../images/JZ01/" + JZ01missionKey[(missionID - 1)] + "200.png') no-repeat");
        $("#ready").css("display", "block");
        var gameContent = $("<div id='JZ01GameContent' style='display:none'></div>");
        var stageOne = $("<div id='JZ01StageOne'><div>");
        var left = $("<img id='JZ01ArrowLeft' src='../../images/JZ01/JZ01ArrowLeft.png' class='JZ01Arrow'/>");
        var cardArea = $("<div id='JZ01CardArea'></div>");
        var right = $("<img id='JZ01ArrowRight' src='../../images/JZ01/JZ01ArrowRight.png' class='JZ01Arrow' />");
        var next = $("<img id='nextStage' src='../../images/JZ01/nextStage.png' />");
        
        var card1 = $("<div class='JZ01card JZ01left JZ01cardHidden'><img src='../../images/JZ01/" + JZ01missionKey[(missionID - 1)] + "200.png' /><p class='JZ01cardPinyin'>" + cardPinyin[0] + "</p><p class='JZ01cardChinese'>" + cardChinese[0] + "</p></div>");
        var card2 = $("<div class='JZ01card JZ01current' id='jz01cardtest'><img src='../../images/JZ01/" + JZ01missionKey[(missionID - 1)] + "201.png' data-win-bind='src: src'/><p class='JZ01cardPinyin'>" + cardPinyin[0] + "</p><p class='JZ01cardChinese'>" + cardChinese[0] + "</p></div>");
        //var card2 = $("<div class='JZ01card JZ01current'><img src='../../images/JZ01/test.JPG' /><p class='JZ01cardPinyin'>" + cardPinyin[0] + "</p><p class='JZ01cardChinese'>" + cardChinese[0] + "</p></div>");
        var card3 = $("<div class='JZ01card JZ01right'><img src='../../images/JZ01/" + JZ01missionKey[(missionID - 1)] + "202.png' /><p class='JZ01cardPinyin'>" + cardPinyin[1] + "</p><p class='JZ01cardChinese'>" + cardChinese[1] + "</p></div>");
        var card4 = $("<div class='JZ01card JZ01none'><img src='../../images/JZ01/" + JZ01missionKey[(missionID - 1)] + "203.png' /><p class='JZ01cardPinyin'>" + cardPinyin[2] + "</p><p class='JZ01cardChinese'>" + cardChinese[2] + "</p></div>");

        cardArea.append(card1).append(card2).append(card3).append(card4);
        stageOne.append(left).append(cardArea).append(right).append(next);
        gameContent.append(stageOne);
        $(".game").append(gameContent);

        var beginAudio = document.getElementById("gameAudio");        
        beginAudio.pause();
        $("#gameAudioSource").attr("src", "../../other/sound/JZ01/" + JZ01missionKey[(missionID - 1)] + "100.wma");
        beginAudio.load();
        beginAudio.play();
        setTimeout(function () {
            $("#ready").fadeOut(2000);
            $("#JZ01GameContent").fadeIn(2000, function () {
                beginAudio.pause();
                $("#gameAudioSource").attr("src", "../../other/sound/JZ01/" + JZ01missionKey[(missionID - 1)] + "101.wma");
                beginAudio.load();
                beginAudio.play();
            });
        }, 4000);
        $(".JZ01card").click(function () {
            var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
            openPicker.suggestedStartLocation =
                Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
            openPicker.viewMode =
                Windows.Storage.Pickers.PickerViewMode.thumbnail;

            openPicker.fileTypeFilter.clear();
            openPicker.fileTypeFilter.append(".bmp");
            openPicker.fileTypeFilter.append(".png");
            openPicker.fileTypeFilter.append(".jpeg");
            openPicker.fileTypeFilter.append(".jpg");
            openPicker.pickSingleFileAsync().done(function (file) {
                if (file) {
                    var imageBlob = URL.createObjectURL(file, { oneTimeOnly: true });
                    photoObject.src = imageBlob;

                    var contentGrid = document.getElementById("jz01cardtest");
                    WinJS.Binding.processAll(contentGrid, photoObject);

                    // Add picked file to MostRecentlyUsedList.
                    localSettings.values["test"] =
                        Windows.Storage.AccessCache.StorageApplicationPermissions
                            .futureAccessList.add(file);

                }
            });
        });        
    }

    function bindStageOneEvent() {
        var missionID = parseInt((localSettings.values["lastGame"])["missionID"]);//1
        var JZ01 = (localSettings.containers.lookup("moduleJZ")).containers.lookup("JZ01");//the contaier JZ01
        var missionNumber = "";//01字符串
        if (missionID < 10) {
            missionNumber = "0" + missionID;
        } else {
            missionNumber = missionID.toString();
        }
        var mString = "M" + missionNumber;//关卡数M01
        var cardNumber = (JZ01.values[mString])["cardNumber"];
        var cardChinese = ((JZ01.values[mString])["cardChinese"].toString()).split("，");
        var cardPinyin = ((JZ01.values[mString])["cardPinyin"].toString()).split("，");

        //cardPostion
        var positions = {
            current: { top: "30px", left: "452px", width: "470px", height: "525px" },
            left: { top: "75px", left: "230px", width: "398px", height: "445px" },
            right: { top: "75px", left: "750px", width: "398px", height: "445px" },
            none: { top: "75px", left: "490px", width: "398px", height: "445px" }
        }
        //imgSize
        var big = { width: "460px", height: "400px", paddingTop: "50px", paddingRight: "70px", paddingBottom: "0", paddingLeft: "70px" };
        var small = { width: "380px", height: "350px", paddingTop: "40px", paddingRight: "60px", paddingBottom: "0", paddingLeft: "60px" };
        //fontSize
        var smallPinyin = { fontSize: "15px" };
        var smallChinese = { fontSize: "30px" };
        var bigPinyin = { fontSize: "25px" };
        var bigChinese = { fontSize: "40px" };

        //下一页
        $("#JZ01ArrowRight").click(function () {
            gameFunction.playEffect("../../audio/normal/click.mp3");
            if (JZ01AnimationBool) {
                var next = $(".JZ01right img").attr("src").toString();//读取右边的卡片编号，因为点击下一页的效果就是把掩藏在最后面的卡片附上新值，然后进行轮播动画
                var cardPositionBegin = next.lastIndexOf("/");
                var cardPositionEnd = next.lastIndexOf(".");
                var cardNumberPrefix = next.slice(cardPositionBegin + 1, cardPositionBegin + 3);//获取前缀，比如a201，获取a2
                var cardNextNumber = parseInt(next.slice(cardPositionBegin + 3, cardPositionBegin + 5)) + 1;//获取后面的数字，比如a201，获取01，转化成int数字之后，再加1，表示下一张的卡片数字
                if (cardNextNumber != (cardNumber + 2)) {
                    if (cardNextNumber == (cardNumber + 1)) {//如果下一张的卡片数字比总数还大，那他轮播到右边来的时候需要隐藏
                        $(".JZ01none").addClass("JZ01cardHidden");
                    }
                    $(".JZ01none").children(":nth-child(2)").html(cardPinyin[(cardNextNumber - 1)]);//新卡片的中文和拼音，因为中文有关卡介绍，所以不需要减1
                    $(".JZ01none").children(":nth-child(3)").html(cardChinese[(cardNextNumber - 1)]);//新卡片的中文和拼音，因为中文有关卡介绍，所以不需要减1
                    var cardPrex = next.slice(0, cardPositionBegin + 3);//读取卡片的地址前缀                    
                    if (cardNextNumber < 10) {//补前缀0的操作
                        cardNextNumber = "0" + cardNextNumber.toString();
                    } else {
                        cardNextNumber = cardNextNumber.toString();
                    }
                    var nextSrc = cardPrex + cardNextNumber + ".png";
                    $(".JZ01none img").attr("src", nextSrc);//更新下一张卡片完成
                    var audio = document.getElementById("gameAudio");//获取配音，并暂停
                    audio.pause();
                    var soundNext = $("#gameAudioSource").attr("src").toString();
                    var soundPositionBegin = soundNext.lastIndexOf("/");
                    var soundPositionEnd = soundNext.lastIndexOf(".");
                    var soundPrex = soundNext.slice(0, soundPositionBegin + 3);//配音地址前缀
                    cardNextNumber = parseInt(cardNextNumber) - 1;//现在cardNextNumber是等等右边卡片的数字，但是下一个要播放的录音是中间卡片的录音，所以要减1
                    if (cardNextNumber < 10) {////补前缀0的操作
                        cardNextNumber = "0" + cardNextNumber.toString();
                    } else {
                        cardNextNumber = cardNextNumber.toString();
                    }
                    var soundNextSrc = soundPrex + cardNextNumber + ".wma";
                    $("#gameAudioSource").attr("src", soundNextSrc);
                    $("#gameAudio").load();//更新下一个配音完成
                    JZ01AnimationBool = false;//现在动画开始播放，不能点击下一个按钮去中断播放
                    setTimeout(function () {
                        $(".JZ01left").css("z-index", 0);
                        $(".JZ01left").animate(positions.none, 500);
                        $(".JZ01left img").animate(small, 500);
                        $(".JZ01left").children(":nth-child(2)").animate(smallPinyin, 500);
                        $(".JZ01left").children(":nth-child(3)").animate(smallChinese, 500);
                    }, 50);
                    setTimeout(function () {
                        $(".JZ01none").css("z-index", 25);
                        $(".JZ01none").animate(positions.right, 500);
                        $(".JZ01none img").animate(small, 500);
                        $(".JZ01none").children(":nth-child(2)").animate(smallPinyin, 500);
                        $(".JZ01none").children(":nth-child(3)").animate(smallChinese, 500);
                    }, 51);
                    setTimeout(function () {
                        $(".JZ01right").css("z-index", 100);
                        $(".JZ01right").animate(positions.current, 500);
                        $(".JZ01right img").animate(big, 500);
                        $(".JZ01right").children(":nth-child(2)").animate(bigPinyin, 500);
                        $(".JZ01right").children(":nth-child(3)").animate(bigChinese, 500);
                    }, 52);
                    setTimeout(function () {
                        $(".JZ01current").css("z-index", 50);
                        $(".JZ01current").animate(positions.left, 500);
                        $(".JZ01current img").animate(small, 500);
                        $(".JZ01current").children(":nth-child(2)").animate(smallPinyin, 500);
                        $(".JZ01current").children(":nth-child(3)").animate(smallChinese, 500, function () {
                            $(".JZ01left").addClass("JZ01temp").removeClass("JZ01left");
                            $(".JZ01current").addClass("JZ01left").removeClass("JZ01current");
                            $(".JZ01right").addClass("JZ01current").removeClass("JZ01right");
                            $(".JZ01none").addClass("JZ01right").removeClass("JZ01none");
                            $(".JZ01temp").addClass("JZ01none").removeClass("JZ01temp");
                            if (parseInt(cardNextNumber) != cardNumber) {//因为初始的时候中央左侧的卡片也有卡片隐藏类，所以需要删除这个类
                                $(".JZ01cardHidden").removeClass("JZ01cardHidden");
                            }
                            var next = document.getElementById("gameAudio");//动画完成了，播放更新后的配音
                            next.play();
                            JZ01AnimationBool = true;//现在可以点击下一页或者上一页去中断配音
                        });
                    }, 53);
                }
            }            
        });
        
        //上一页
        $("#JZ01ArrowLeft").click(function () {
            gameFunction.playEffect("../../audio/normal/click.mp3");
            if (JZ01AnimationBool) {
                var prev = $(".JZ01left img").attr("src").toString();
                var cardPositionBegin = prev.lastIndexOf("/");
                var cardPositionEnd = prev.lastIndexOf(".");
                var cardNumberPrefix = prev.slice(cardPositionBegin + 1, cardPositionBegin + 3);
                var cardPrevNumber = parseInt(prev.slice(cardPositionBegin + 3, cardPositionBegin + 5)) - 1;
                if (cardPrevNumber != -1) {
                    if (cardPrevNumber == 0) {
                        $(".JZ01none").addClass("JZ01cardHidden");
                    }
                    $(".JZ01none").children(":nth-child(2)").html(cardPinyin[(cardPrevNumber - 1)]);//新卡片的中文和拼音，因为中文有关卡介绍，所以不需要减1
                    $(".JZ01none").children(":nth-child(3)").html(cardChinese[(cardPrevNumber - 1)]);//新卡片的中文和拼音，因为中文有关卡介绍，所以不需要减1
                    var cardPrex = prev.slice(0, cardPositionBegin + 3);
                    if (cardPrevNumber < 10) {
                        cardPrevNumber = "0" + cardPrevNumber.toString();
                    } else {
                        cardPrevNumber = cardPrevNumber.toString();
                    }
                    var prevSrc = cardPrex + cardPrevNumber + ".png";
                    $(".JZ01none img").attr("src", prevSrc);
                    var audio = document.getElementById("gameAudio");
                    audio.pause();
                    var soundPrev = $("#gameAudioSource").attr("src").toString();
                    var soundPositionBegin = soundPrev.lastIndexOf("/");
                    var soundPositionEnd = soundPrev.lastIndexOf(".");
                    var soundPrex = soundPrev.slice(0, soundPositionBegin + 3);
                    cardPrevNumber = parseInt(cardPrevNumber) + 1;
                    if (cardPrevNumber < 10) {
                        cardPrevNumber = "0" + cardPrevNumber.toString();
                    } else {
                        cardPrevNumber = cardPrevNumber.toString();
                    }
                    var soundPrevSrc = soundPrex + cardPrevNumber + ".wma";
                    $("#gameAudioSource").attr("src", soundPrevSrc);
                    $("#gameAudio").load();
                    JZ01AnimationBool = false;
                    setTimeout(function () {
                        $(".JZ01right").css("z-index", 0);
                        $(".JZ01right").animate(positions.none, 500);
                        $(".JZ01right img").animate(small, 500);
                        $(".JZ01right").children(":nth-child(2)").animate(smallPinyin, 500);
                        $(".JZ01right").children(":nth-child(3)").animate(smallChinese, 500);
                    }, 50);
                    setTimeout(function () {
                        $(".JZ01none").css("z-index", 25);
                        $(".JZ01none").animate(positions.left, 500);
                        $(".JZ01none img").animate(small, 500);
                        $(".JZ01none").children(":nth-child(2)").animate(smallPinyin, 500);
                        $(".JZ01none").children(":nth-child(3)").animate(smallChinese, 500);
                    }, 51);
                    setTimeout(function () {
                        $(".JZ01left").css("z-index", 100);
                        $(".JZ01left").animate(positions.current, 500);
                        $(".JZ01left img").animate(big, 500);
                        $(".JZ01left").children(":nth-child(2)").animate(bigPinyin, 500);
                        $(".JZ01left").children(":nth-child(3)").animate(bigChinese, 500);
                    }, 52);
                    setTimeout(function () {
                        $(".JZ01current").css("z-index", 50);
                        $(".JZ01current").animate(positions.right, 500);
                        $(".JZ01current img").animate(small, 500);
                        $(".JZ01current").children(":nth-child(2)").animate(smallPinyin, 500);
                        $(".JZ01current").children(":nth-child(3)").animate(smallChinese, 500, function () {
                            $(".JZ01right").addClass("JZ01temp").removeClass("JZ01right");
                            $(".JZ01current").addClass("JZ01right").removeClass("JZ01current");
                            $(".JZ01left").addClass("JZ01current").removeClass("JZ01left");
                            $(".JZ01none").addClass("JZ01left").removeClass("JZ01none");
                            $(".JZ01temp").addClass("JZ01none").removeClass("JZ01temp");
                            if (parseInt(cardPrevNumber) != 1) {
                                $(".JZ01cardHidden").removeClass("JZ01cardHidden");
                            }
                            var next = document.getElementById("gameAudio");
                            next.play();
                            JZ01AnimationBool = true;
                        });
                    }, 53);
                }
            }            
        });
        
        //进入下一阶段
        $("#nextStage").click(function () {
            gameFunction.playEffect("../../audio/normal/click.mp3");
            var audio = document.getElementById("gameAudio");
            audio.pause();
            question = [];//两个问题数组清空
            questionNum = [];//问题塞进数组
            for (var i = 0; i < cardNumber; i++) {
                if (i < 9) {
                    question[i] = JZ01missionKey[(missionID - 1)].toString() + "20" + (i + 1).toString();
                } else {
                    question[i] = JZ01missionKey[(missionID - 1)].toString() + "2" + (i + 1).toString();
                }
                questionNum[i] = i;
            }
            createStageTwo();
        });

        //如果配音结束，那就再放一遍
        $("#JZ01Repeat").click(function () {
            gameFunction.playEffect("../../audio/normal/click.mp3");
            var myBool = (document.getElementById("gameAudio"))["ended"];
            if (myBool) {
                var audio = document.getElementById("gameAudio");
                audio.play();
            }
            if ($("#JZ01GameContent").children("div").attr("id") != "JZ01stageOne" && question.length != 0) {
                JZ01score--;
                showScore();
            }
        });

        var audioEnded = document.getElementById("gameAudio");
        audioEnded.onended = function () {
            if ($("#JZ01GameContent").children("div").attr("id") != "JZ01stageOne" && question.length != 0) {//如果是第二阶段，问题配音一放完就开启减分器和提示器
                minus = setInterval(function () {
                    JZ01score--;
                    showScore();
                }, 500);//每过0.5秒扣一分
                tips = setTimeout(function () {//快3秒了就不扣分了，出现提示手势
                    clearInterval(minus);
                    var audioSrc = $("#gameAudioSource").attr("src");
                    var audioBegin = audioSrc.lastIndexOf("/");
                    var audioEnd = audioSrc.lastIndexOf(".");
                    var key = audioSrc.slice(audioBegin + 1, audioEnd);
                    $(".JZ01fourCards img").each(function () {
                        if (($(this).attr("src").toString()).indexOf(key) != -1) {
                            $(this).parent().append("<div class='JZ01tips'></div>");
                        }
                    });
                    var beginAudio = document.getElementById("effectAudio");
                    beginAudio.pause();
                    $("#effectAudioSource").attr("src", "../../other/sound/JZ01/4.wma");
                    beginAudio.load();
                    beginAudio.play();
                }, 2900);
            }                      
        }
    }

    function showScore() {
        $("#testArea").html("现在的分数是：" + JZ01score + "");
    }

    function createStageTwo() {
        $("#JZ01StageOne").remove();//如果有第一阶段的DIV就删除
        $(".JZ01game").css("background", "url('../../images/JZ01/JZ01BG2.png') no-repeat")
        showScore();//展示一下分数呗
        var missionID = parseInt((localSettings.values["lastGame"])["missionID"]);//1
        var JZ01 = (localSettings.containers.lookup("moduleJZ")).containers.lookup("JZ01");//the contaier JZ01
        var missionNumber = "";//01字符串
        if (missionID < 10) {
            missionNumber = "0" + missionID;
        } else {
            missionNumber = missionID.toString();
        }
        var mString = "M" + missionNumber;//关卡数M01
        var cardNumber = (JZ01.values[mString])["cardNumber"];
        var cardChinese = ((JZ01.values[mString])["cardChinese"].toString()).split("，");
        var cardPinyin = ((JZ01.values[mString])["cardPinyin"].toString()).split("，");
        var effect = ["fallOut", "slideOut", "fallRotateOut", "scaleRotateOut", "StackOut", "flipOut", "superscaleOut", "centerFlipOut", "fallIn", "slideIn", "fallRotateIn", "scaleRotateIn", "StackIn", "flipIn", "superscaleIn", "centerFlipIn"];
        var divNumber = 5;//展示卡片的上限
        //刚开始的时候，question数组的长度和卡片总数是一样的，所以刚开始的时候要添加stageTwo的div
        if (question.length != cardNumber) {
            for (var j = 0; j <= 7; j++) {
                if ($(".JZ01new").hasClass(effect[j + 8])) {
                    $(".JZ01new").removeClass(effect[j + 8]).removeClass("JZ01new").addClass("JZ01old");
                }
            }
        } else {
            $("#JZ01GameContent").append("<div id='JZ01StageTwo'></div>");
            $("#JZ01StageTwo").append("<div id='JZ01fourCard'></div>");
            $("#JZ01StageTwo").append("<img src='../../images/JZ01/JZ01girl1.png' id='JZ01girl'/>");
        }
        //如果最后一波卡片了，那就改一下展示卡片的上限
        if (question.length < 4) {
            divNumber = question.length + 1;
        }

        for (var i = 1; i < divNumber; i++) {
            var randomNumber = randomFunction(0, question.length - 1);
            $("#JZ01fourCard").append("<div class='JZ01fourCards JZ01new JZ01fallIn' id='JZ01card" + i + "' data-answered='false'><img src='../../images/JZ01/" + question[randomNumber] + ".png' /><p>" + cardPinyin[(questionNum[randomNumber])] + "</p><p class='fourCardChinese'>" + cardChinese[questionNum[randomNumber]] + "</p></div>");
            questionFour[(i - 1)] = question[randomNumber];
            question.splice(randomNumber, 1);
            questionNum.splice(randomNumber, 1);            
        }

        var effectNumber = Math.round(Math.random() * 7);
        $(".JZ01tickDiv").hide("slow");
        $(".JZ01old").addClass(effect[effectNumber]);
        $(".JZ01new").addClass(effect[effectNumber + 8]);

        setTimeout(function () {
            $(".JZ01old").remove();
            $(".JZ01tickDiv").remove();
        }, 600);

        beginQuestion();
        $(".JZ01fourCards").click(function () {
            if (JZ01CanClick) {
                if ($(this).attr("data-answered") == "false") {
                    JZ01CanClick = false;
                    var imageSrc = $(this).children("img").attr("src");
                    var answerBegin = imageSrc.lastIndexOf("/");
                    var answerEnd = imageSrc.lastIndexOf(".");
                    var answer = imageSrc.slice(answerBegin + 1, answerEnd);
                    var audioSrc = $("#gameAudioSource").attr("src");
                    var audioBegin = audioSrc.lastIndexOf("/");
                    var audioEnd = audioSrc.lastIndexOf(".");
                    var key = audioSrc.slice(audioBegin + 1, audioEnd);
                    var result = "";
                    if (answer == key) {
                        gameFunction.playEffect("../../audio/JZ01/right.mp3");
                        result = "../../images/JZ01/JZ01right.png";
                        clearInterval(minus);
                        clearTimeout(tips);
                        $(".JZ01tips").remove();
                        $("#JZ01girl").attr("src", "../../images/JZ01/JZ01girl2.png");
                        setTimeout(function () {
                            $("#JZ01girl").attr("src", "../../images/JZ01/JZ01girl1.png");
                            setTimeout(function () {
                                $("#JZ01girl").attr("src", "../../images/JZ01/JZ01girl2.png");
                                setTimeout(function () {
                                    $("#JZ01girl").attr("src", "../../images/JZ01/JZ01girl1.png");
                                    setTimeout(function () {
                                        $("#JZ01girl").attr("src", "../../images/JZ01/JZ01girl2.png");
                                        setTimeout(function () {
                                            $("#JZ01girl").attr("src", "../../images/JZ01/JZ01girl1.png");
                                        }, 200);
                                    }, 200);
                                }, 200);
                            }, 200);
                        }, 200);
                        showScore();
                    } else {
                        gameFunction.playEffect("../../audio/JZ01/wrong.mp3");
                        result = "../../images/JZ01/JZ01wrong.png";
                        JZ01score = JZ01score - 5;
                        showScore();
                    };
                    switch ($(this).attr("id")) {
                        case "JZ01card1":
                            $("#JZ01card1").append("<div class='JZ01tickDiv " + (answer == key) + "'><img src='" + result + "' class='JZ01tick'/></div>");
                            $("#JZ01card1 div").animate({
                                width: "100px"
                            }, 250, "linear");
                            break;
                        case "JZ01card2":
                            $("#JZ01card2").append("<div class='JZ01tickDiv " + (answer == key) + "'><img src='" + result + "' class='JZ01tick'/></div>");
                            $("#JZ01card2 div").animate({
                                width: "100px"
                            }, 250, "linear");
                            break;
                        case "JZ01card3":
                            $("#JZ01card3").append("<div class='JZ01tickDiv " + (answer == key) + "'><img src='" + result + "' class='JZ01tick'/></div>");
                            $("#JZ01card3 div").animate({
                                width: "100px"
                            }, 250, "linear");
                            break;
                        case "JZ01card4":
                            $("#JZ01card4").append("<div class='JZ01tickDiv " + (answer == key) + "'><img src='" + result + "' class='JZ01tick'/></div>");
                            $("#JZ01card4 div").animate({
                                width: "100px"
                            }, 250, "linear");
                            break;
                    }
                    if (answer != key) {//错误的话需要删除X
                        setTimeout(function () {
                            $(".false").remove();
                            JZ01CanClick = true;
                        }, 1000);
                    } else {//正确的话right的数量增1
                        JZ01CanClick = true;
                        rightCount++;
                        $(this).attr("data-answered", "true");
                        if (rightCount != (divNumber - 1)) {//如果没有等于最大上限，继续提问
                            beginQuestion();
                        } else {//等于最大上限有两种情况，一种是通关了，一种是换下一批
                            if (divNumber < 5 || question.length == 0) {//通关的话rightCount清零
                                rightCount = 0;
                                gameFinish(JZ01score, mString)
                            } else {//换下一批
                                setTimeout(function () {
                                    rightCount = 0;
                                    createStageTwo();
                                }, 500);
                            }
                        }
                    }
                }
            }
                       
        })   
    }
    //提问函数
    function beginQuestion() {
        var randomNumber = randomFunction(0, questionFour.length - 1);
        var audio = document.getElementById("gameAudio");
        audio.pause();
        var soundNext = $("#gameAudioSource").attr("src").toString();
        var soundPositionBegin = soundNext.lastIndexOf("/");
        var soundPositionEnd = soundNext.lastIndexOf(".");
        var soundPrex = soundNext.slice(0, soundPositionBegin + 1);
        var soundNextSrc = soundPrex + questionFour[randomNumber] + ".wma";
        $("#gameAudioSource").attr("src", soundNextSrc);
        $("#gameAudio").load();
        questionFour.splice(randomNumber, 1);
        var next = document.getElementById("gameAudio");
        next.play();
    }

    //通关函数
    function gameFinish(score, mString) {
        $(".JZ01game").append("<div id='JZ01gameFinish' style='display:none'></div>");
        $("#JZ01gameFinish").append("<div id='JZ01starControl'></div>");
        $("#JZ01gameFinish").fadeIn("slow");
        for (var i = 0; i < 3; i++) {
            $("#JZ01starControl").append("<div id='star"+(i+1)+"' class='JZ01starEmpty'></div>");
        }
        $("#JZ01gameFinish").append("<div id='JZ01missionControl'></div>");
        var missionStar = 0;
        if (score >= 90) {//评星
            missionStar = 3;
            $("#JZ01gameFinish").append("<img src='../../images/JZ01/JZ01pass.png' id='JZ01gameFinishTitle'/>");
            $("#JZ01missionControl").append("<div id='backtoMission'></div><div id='replay'></div><div id='nextMission'></div>");
            var beginAudio = document.getElementById("gameAudio");
            beginAudio.pause();
            $("#gameAudioSource").attr("src", "../../other/sound/JZ01/3.wma");
            beginAudio.load();
            beginAudio.play();
        } else if (score >= 70) {
            missionStar = 2;
            $("#JZ01gameFinish").append("<img src='../../images/JZ01/JZ01pass.png' id='JZ01gameFinishTitle'/>");
            $("#JZ01missionControl").append("<div id='backtoMission'></div><div id='replay'></div><div id='nextMission'></div>");
            var beginAudio = document.getElementById("gameAudio");
            beginAudio.pause();
            $("#gameAudioSource").attr("src", "../../other/sound/JZ01/2.wma");
            beginAudio.load();
            beginAudio.play();
        } else if (score >= 50) {
            missionStar = 1;
            $("#JZ01gameFinish").append("<img src='../../images/JZ01/JZ01pass.png' id='JZ01gameFinishTitle'/>");
            $("#JZ01missionControl").append("<div id='backtoMission'></div><div id='replay'></div><div id='nextMission'></div>");
            var beginAudio = document.getElementById("gameAudio");
            beginAudio.pause();
            $("#gameAudioSource").attr("src", "../../other/sound/JZ01/1.wma");
            beginAudio.load();
            beginAudio.play();
        } else {
            missionStar = 0;
            $("#JZ01gameFinish").append("<img src='../../images/JZ01/JZ01passNot.png' id='JZ01gameFinishTitle'/>");
            $("#JZ01missionControl").append("<div id='backtoMission'></div><div id='replay'></div><div id='noNextMission'></div>");
            var beginAudio = document.getElementById("gameAudio");
            beginAudio.pause();
            $("#gameAudioSource").attr("src", "../../other/sound/JZ01/0.wma");
            beginAudio.load();
            beginAudio.play();
        }
        for (var i = 0; i < missionStar; i++) {
            $("#star" + (i + 1).toString()).append("<div class='JZ01star' id='JZ01star"+(i+1)+"'></div>");
        }
        setTimeout(function () {
            $("#JZ01star1").css("opacity", "1.0");
        }, 850);
        setTimeout(function () {
            $("#JZ01star2").css("opacity", "1.0");
        }, 1350);
        setTimeout(function () {
            $("#JZ01star3").css("opacity", "1.0");
        }, 1850);
        var nextMission = parseInt((localSettings.values["lastGame"])["missionID"]) + 1;
        var newVal = (localSettings.values["lastGame"]);
        var JZ01 = (localSettings.containers.lookup("moduleJZ")).containers.lookup("JZ01");//the contaier JZ01
        var progressBar = parseInt((localSettings.containers.lookup("moduleJZ")).values["progressBar"]);
        newVal.insert("missionID", nextMission);
        localSettings.values["lastGame"] = newVal;
        newVal = JZ01.values[mString];
        if (newVal["isFinish"] == false) {
            newVal.insert("isFinish", true);
            (localSettings.containers.lookup("moduleJZ")).containers.lookup("JZ01").values["lastestMission"] = nextMission-1;
        }
        if (score >= newVal["score"]) {
            progressBar += parseInt((JZ01score - newVal["score"]) / 5);
            if (progressBar >= 100) {
                progressBar = progressBar-100;
                (localSettings.containers.lookup("moduleJZ")).values["level"] = parseInt((localSettings.containers.lookup("moduleJZ")).values["level"])+1;
            }
            newVal.insert("score", JZ01score);
            newVal.insert("starLevel", missionStar);
        }
        (localSettings.containers.lookup("moduleJZ")).containers.lookup("JZ01").values[mString] = newVal;
        (localSettings.containers.lookup("moduleJZ")).values["progressBar"] = progressBar;
        JZ01score = 100;//分数重置为100
        $("#backtoMission").click(function () {
            gameFunction.playEffect("../../audio/normal/click.mp3");
            WinJS.Navigation.navigate("/pages/mission/mission.html");
        })
        $("#replay").click(function () {
            gameFunction.playEffect("../../audio/normal/click.mp3");
            newVal = (localSettings.values["lastGame"]);
            newVal.insert("missionID", nextMission - 1);
            localSettings.values["lastGame"] = newVal;
            var next = document.getElementById("gameAudio");
            next.pause();
            JZ01Init();
        })
        $("#nextMission").click(function () {
            gameFunction.playEffect("../../audio/normal/click.mp3");
            var next = document.getElementById("gameAudio");
            next.pause();
            JZ01Init();
        })
    }

    function JZ01Init() {
        for (var i = 0; i < gameFragment.length; i++) {
            if ($(".game").hasClass(gameFragment[i])) {
                $(".game").removeClass(gameFragment[i]);
            }            
        }
        $(".game").children().remove();
        $(".game").addClass("JZ01game");
        var repeat = $("<img id='JZ01Repeat' src='../../images/JZ01/repeat.png' />");
        var music = $("<img id='JZ01Music' src='../../images/JZ01/music.png' />");
        $(".game").append(repeat);
        $(".game").append(music);
        createStageOne();
        bindStageOneEvent();
        //createStageTwo();
    }


    function JZ02Init() {
        $("#Cocos2dGameContainer").css("display", "block");
        cc.Director.getInstance().resume();
        var nextScene = cc.Scene.create();
        var nextLayer = new JZ02Layer;
        nextScene.addChild(nextLayer);
        nextLayer.init();
        cc.Director.getInstance().replaceScene(nextScene);

    }


    function JZ03Init() {
        $("#Cocos2dGameContainer").css("display", "block");
        cc.Director.getInstance().resume();
        var nextScene = cc.Scene.create();
        var nextLayer = new JZ03Layer;
        nextScene.addChild(nextLayer);
        nextLayer.init();
        cc.Director.getInstance().replaceScene(nextScene);

    }


    function MZB01Init() {
        $("#Cocos2dGameContainer").css("display", "block");
        cc.Director.getInstance().resume();
        var nextScene = cc.Scene.create();
        var nextLayer = new MZB01Layer;
        nextScene.addChild(nextLayer);
        nextLayer.init();
        cc.Director.getInstance().replaceScene(nextScene);

    }



    //Three.js
    function MZH01Init() {
        $("#Cocos2dGameContainer").css("display", "block");
        cc.Director.getInstance().resume();
        var nextScene = cc.Scene.create();
        var nextLayer = new MZH01Layer;
        //var nextLayer = new MZH01AnotherLayer;
        nextScene.addChild(nextLayer);
        nextLayer.init();
        cc.Director.getInstance().replaceScene(nextScene);
    }

    WinJS.Namespace.define("gameInit", {
        JZ01Init: JZ01Init,
        JZ02Init: JZ02Init,
        JZ03Init: JZ03Init,
        MZH01Init: MZH01Init,
        MZB01Init: MZB01Init
    });
})();