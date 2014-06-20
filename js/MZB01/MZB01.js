var MZB01Layer = cc.LayerColor.extend({
    answer: 1,
    temp: null,
    minDuration: 2.5,
    maxDuration: 4,
    addFlowerMode: 1,//1 is normal,2 is change good,3 is change bad
    flowerPositions:
        [
            [[0, 0, 200, 180], [220, 0, 200, 180], [438, 0, 200, 180], [656, 0, 200, 180], [871, 0, 200, 180]],
            [[0, 0, 200, 179], [226, 0, 200, 179], [455, 0, 202, 179], [677, 0, 200, 179], [891, 0, 200, 179]],
            [[0, 0, 197, 179], [230, 0, 198, 179], [464, 0, 200, 179], [682, 0, 200, 179], [907, 0, 203, 179]],
            [[0, 0, 197, 183], [218, 0, 200, 183], [442, 0, 200, 183], [658, 0, 202, 183], [879, 0, 198, 183]],
            [[0, 0, 196, 179], [212, 0, 202, 179], [432, 0, 199, 179], [642, 0, 198, 179], [851, 0, 199, 179]],
            [[0, 0, 200, 181], [218, 0, 200, 181], [444, 0, 200, 181], [664, 0, 200, 181], [882, 0, 197, 181]],
            [[0, 0, 197, 180], [217, 0, 200, 180], [454, 0, 198, 180], [670, 0, 202, 180], [893, 0, 196, 180]],
            [[0, 0, 199, 179], [225, 0, 197, 179], [444, 0, 199, 179], [655, 0, 198, 179], [880, 0, 199, 179]],
            [[0, 0, 200, 180], [220, 0, 199, 180], [441, 0, 199, 180], [662, 0, 202, 180], [890, 0, 201, 180]],
            [[0, 0, 200, 181], [225, 0, 200, 181], [445, 0, 199, 181], [659, 0, 198, 181], [883, 0, 197, 181]],
            [[15, 0, 199, 179], [240, 0, 197, 179], [464, 0, 198, 179], [689, 0, 197, 179], [913, 0, 197, 179]],
            [[13, 0, 202, 179], [240, 0, 199, 179], [464, 0, 199, 179], [690, 0, 198, 179], [914, 0, 197, 179]],
            [[14, 0, 200, 186], [238, 0, 200, 186], [473, 0, 198, 186], [685, 0, 203, 186], [906, 0, 203, 186]],
            [[13, 0, 201, 183], [241, 0, 197, 183], [464, 0, 199, 183], [693, 0, 198, 183], [915, 0, 193, 183]],
            [[13, 16, 200, 196], [241, 16, 198, 196], [473, 16, 198, 196], [693, 16, 199, 196], [913, 16, 198, 196]]
        ],
    flowerPosition: [[0, 0, 230, 177], [230, 0, 225, 177], [455, 0, 220, 177], [675, 0, 210, 177], [885, 0, 210, 177]],
    toolsPosition: [[0, 0, 40, 71], [50, 0, 85, 71], [140, 0, 95, 71], [240, 0, 77, 71]],
    missionPng:[mission1PNG,mission2PNG,mission3PNG,mission4PNG,mission5PNG,mission6PNG,mission7PNG,mission8PNG,mission9PNG,mission10PNG,mission11PNG,mission12PNG,mission13PNG,mission14PNG,mission15PNG],
    comboPng: [combo2, combo3, combo4, combo5],
    comboPngSize: [[331, 91], [322, 82], [331, 91], [329, 95]],
    nowMissionNum: 1,
    combo:0,
    time: 60,
    score: 0,
    starLevel: 0,
    scoreTime: 1,
    gameOverBool: false,
    localSettings: Windows.Storage.ApplicationData.current.localSettings,
    moduleMZ: Windows.Storage.ApplicationData.current.localSettings.containers.lookup("moduleMZ"),
    MZB: (Windows.Storage.ApplicationData.current.localSettings.containers.lookup("moduleMZ")).containers.lookup("MZB"),
    MZB01: ((Windows.Storage.ApplicationData.current.localSettings.containers.lookup("moduleMZ")).containers.lookup("MZB")).containers.lookup("MZB01"),
    fever: false,
    

        
    init: function () {

        //////////////////////////////
        // 1. super init first
        this._super();
        this._flowers = [];
        this._tools = [];
        //this._flowersSpeed = [];

        //初始化关卡
        this.nowMissionNum = parseInt((this.localSettings.values["lastGame"])["missionID"]);
        this.flowerPosition = this.flowerPositions[this.nowMissionNum - 1];
        this.props = this.MZB01.values["props"].split(",");
        for (var i = 0; i < 4; i++) {
            this.props[i] = parseInt(this.props[i]);
        }        
        this.winSize = cc.Director.getInstance().getWinSize();
        this.origin = cc.Director.getInstance().getVisibleOrigin();

        //background
        this.bg = cc.Sprite.create(MZB01BG, cc.rect(0, 0, 1920, 1080));
        this.bg.setPosition(cc.p(this.origin.x + 683, this.origin.y + 384));
        this.bg.setScale(0.72);
        this.addChild(this.bg, 1);

        //boy
        this.boy = cc.Sprite.create(testMZB01PeopleLeft, cc.rect(0, 0, 126, 161));
        this.boy.setPosition(cc.p(this.origin.x + this.winSize.width / 2, this.origin.y + this.boy.getContentSize().height / 2));
        this.boy.setScale(0.72);
        this.addChild(this.boy, 2);

        //answer
        this.temp = cc.Sprite.create(this.missionPng[this.nowMissionNum - 1], cc.rect(this.flowerPosition[this.answer - 1][0], this.flowerPosition[this.answer - 1][1], this.flowerPosition[this.answer - 1][2], this.flowerPosition[this.answer - 1][3]));
        this.temp.setPosition(cc.p(this.origin.x + 180, this.origin.y + this.boy.getContentSize().height / 2 + 170));
        this.temp.setScale(0.7);
        this.addChild(this.temp, 1);

        //scoreText
        this.scoreLabel = cc.LabelTTF.create("Score: 0", "myEnglish", 40);
        this.scoreLabel.setAnchorPoint(0.0, 0.0);
        this.scoreLabel.setPosition(cc.p(this.origin.x, this.origin.y + 650));
        this.addChild(this.scoreLabel, 1);

        //timeText
        this.timeLabel = cc.LabelTTF.create("Time : 60", "myEnglish", 40);
        this.timeLabel.setAnchorPoint(0.0, 0.0);
        this.timeLabel.setPosition(cc.p(this.origin.x, this.origin.y + 600));
        this.addChild(this.timeLabel, 1);        

        this.circlePosition = [[15, 327], [71, 327], [127, 327], [183, 327]];
        for (var i = 0; i < 4; i++) {
            var circle = cc.Sprite.create(circleImg, cc.rect(0, 0, 25, 25));
            circle.setPosition(this.circlePosition[i][0], this.circlePosition[i][1]+45);
            circle.setScale(0.72);
            this.addChild(circle,3);
        }

        //double
        this.doubleLabel = cc.LabelTTF.create(this.props[0], "Courier", 10);
        this.doubleLabel.setPosition(cc.p(this.circlePosition[3][0], this.circlePosition[3][1] + 45));
        this.addChild(this.doubleLabel, 3);

        //good
        this.goodLabel = cc.LabelTTF.create(this.props[1], "Courier", 10);
        this.goodLabel.setPosition(cc.p(this.circlePosition[0][0], this.circlePosition[0][1] + 45));
        this.addChild(this.goodLabel, 3);

        //time
        this.timeToolLabel = cc.LabelTTF.create(this.props[2], "Courier", 10);
        this.timeToolLabel.setPosition(cc.p(this.circlePosition[1][0], this.circlePosition[1][1] + 45));
        this.addChild(this.timeToolLabel, 3);

        //suck
        this.suckLabel = cc.LabelTTF.create(this.props[3], "Courier", 10);
        this.suckLabel.setPosition(cc.p(this.circlePosition[2][0], this.circlePosition[2][1] + 45));
        this.addChild(this.suckLabel, 3);

        //audioEngine
        this.gSharedEngine = cc.AudioEngine.getInstance();
        this.gSharedEngine.init();
        this.gSharedEngine.setMusicVolume(1);
        this.gSharedEngine.setEffectsVolume(1);
        this.gSharedEngine.playMusic(MZB01BGMusic);

        //drop the flowers
        this.schedule(this.addFlowers, 0.2);
        //drop the tools
        this.schedule(this.addTools, 1.5);
        //change the answer
        this.schedule(this.changeAnswer, 10.0);
        //change the time
        this.schedule(this.timeCount, 1.0);
        //update like detect the punch
        this.schedule(this.updateGame);

        //menu
        this.doubleToolMission = cc.MenuItemImage.create(
                doubleScore,
                doubleScorePress,
                this.doubleToolCallBack,
                this
            );
        this.doubleToolMission.setPosition(183, 327);
        this.doubleToolMission.setScale(0.72);
        this.goodToolMission = cc.MenuItemImage.create(
                changeGood,
                changeGoodPress,
                this.goodToolCallBack,
                this
            );
        this.goodToolMission.setPosition(15, 327);
        this.goodToolMission.setScale(0.72);
        this.timeToolMission = cc.MenuItemImage.create(
                addTime,
                addTimePress,
                this.timeToolCallBack,
                this
            );
        this.timeToolMission.setPosition(71, 327);
        this.timeToolMission.setScale(0.72);
        this.suckToolMission = cc.MenuItemImage.create(
                suckThing,
                suckThingPress,
                this.suckToolCallBack,
                this
            );
        this.suckToolMission.setPosition(127, 327);
        this.suckToolMission.setScale(0.72);
        this.pauseMission = cc.MenuItemImage.create(
                pause,
                pausePress,
                this.returnMissionCallBack,
                this
            );
        this.pauseMission.setPosition(1300, 700);
        this.pauseMission.setScale(0.72);
        this.menu = cc.Menu.create(this.doubleToolMission, this.goodToolMission, this.timeToolMission, this.suckToolMission, this.pauseMission);
        this.menu.setAnchorPoint(0, 0);
        this.menu.setPosition(25, 20);
        this.addChild(this.menu,2);

        this.setKeyboardEnabled(true);
        this.setTouchEnabled(true);
        return true;
    },

    returnMissionCallBack: function () {
        gameFunction.playEffect("../../audio/normal/click.mp3");
        cc.Director.getInstance().pause();
        cc.AudioEngine.getInstance().stopMusic(true);
        $("#Cocos2dGameContainer").css("display", "none");
        WinJS.Navigation.navigate("/pages/mission/mission.html");
    },

    replayCallBack:function(){
        gameFunction.playEffect("../../audio/normal/click.mp3");
        cc.Director.getInstance().pause();
        cc.AudioEngine.getInstance().stopMusic(true);
        cc.Director.getInstance().resume();
        var nextScene = cc.Scene.create();
        var nextLayer = new MZB01Layer;
        nextScene.addChild(nextLayer);
        nextLayer.init();
        cc.Director.getInstance().replaceScene(nextScene);
    },

    doubleToolCallBack: function () {
        if (this.props[0] > 0) {
            this.scoreTime = 2;
            this.scheduleOnce(function () {
                this.scoreTime = 1;
            }, 5);
            this.props[0] -= 1;
            this.doubleLabel.setString(this.props[0]);
            this.gSharedEngine.playEffect(MZB01FeverEffect);
        }        
    },

    goodToolCallBack:function(){
        if (this.props[1] > 0) {
            this.addFlowerMode = 2;
            this.scheduleOnce(function () {
                this.addFlowerMode = 1;
            }, 5);
            this.props[1] -= 1;
            this.goodLabel.setString(this.props[1]);
            this.gSharedEngine.playEffect(MZB01GoodEffect);
        }
    },

    timeToolCallBack: function () {
        if (this.props[2] > 0) {
            this.time += 5;
            this.props[2] -= 1;
            this.timeToolLabel.setString(this.props[2]);
            this.gSharedEngine.playEffect(MZB01TimeEffect);
        }
    },

    suckToolCallBack: function () {
        if (this.props[3] > 0) {
            for (var i = 0; i < this._flowers.length; i++) {
                var flower = this._flowers[i];
                if (flower.getTag() == this.answer) {
                    flower.stopAllActions();
                    var actionMove = cc.MoveTo.create(0.5, cc.p(this.boy.getPositionX(), this.boy.getPositionY()));
                    flower.runAction(actionMove);
                }
            }
            this.props[3] -= 1;
            this.suckLabel.setString(this.props[3]);
            this.gSharedEngine.playEffect(MZB01SuckEffect);
        }
    },

    onTouchesMoved: function (touches, event) {
        var touch = touches[0];
        var location = touch.getLocation();
        if (this.onClickFlag && (!this.gameOverBool)) {
            if (location.x > this.boy.getPositionX()) {
                this.removeChild(this.boy, true);
                if (this.fever) {
                    this.boy = cc.Sprite.create(testMZB01PeopleRightGlod, cc.rect(0, 0, 125, 161));
                } else {
                    this.boy = cc.Sprite.create(testMZB01PeopleRight, cc.rect(0, 0, 125, 161));
                }
                this.boy.setScale(0.72);
                this.boy.setPosition(cc.p(location.x, location.y));
                this.addChild(this.boy, 2);
            } else {
                this.removeChild(this.boy, true);
                if (this.fever) {
                    this.boy = cc.Sprite.create(testMZB01PeopleLeftGlod, cc.rect(0, 0, 126, 161));
                } else {
                    this.boy = cc.Sprite.create(testMZB01PeopleLeft, cc.rect(0, 0, 126, 161));
                }
                this.boy.setScale(0.72);
                if (location.x < 280) {
                    this.boy.setPosition(cc.p(280, location.y));
                } else {
                    this.boy.setPosition(cc.p(location.x, location.y));
                }                
                this.addChild(this.boy, 2);
            }
        }
    },

    onTouchesEnded: function (touches, event) {
        this.onClickFlag = false;
    },

    onTouchesBegan: function (touches, event) {
        var touch = touches[0];
        var location = touch.getLocation();
        if (cc.rectContainsPoint(this.boy.getBoundingBox(), location)) {
            this.onClickFlag = true;
        }
    },

    onKeyUp: function (e) { },

    onKeyDown: function (e) {
        if (e == cc.KEY.left) {
            var lastX = this.boy.getPositionX();
            this.removeChild(this.boy, true);
            this.boy = cc.Sprite.create(testMZB01PeopleRight, cc.rect(0, 0, 80, 109));
            this.boy.setPosition(cc.p(lastX-20, this.origin.y + this.boy.getContentSize().height / 2));
            this.addChild(this.boy, 2);
        } else if (e == cc.KEY.right) {
            var lastX = this.boy.getPositionX()
            this.removeChild(this.boy, true);
            this.boy = cc.Sprite.create(testMZB01PeopleLeft, cc.rect(0, 0, 80, 109));
            this.boy.setPosition(cc.p(lastX + 20, this.origin.y + this.boy.getContentSize().height / 2));
            this.addChild(this.boy, 2);
        }
    },
    //添加花朵
    addFlowers: function () {
        var flower;
        switch (this.addFlowerMode) {
            case 1:
                flower = this.returnFlower(Math.round(Math.random() * (5 - 1)) + 1, 0.3);
                break;
            case 2:
                flower = this.returnFlower(this.answer, 0.3);
                break;
            case 3:
                var tempAnswer = this.answer;
                while (tempAnswer == this.answer) {
                    tempAnswer = Math.round(Math.random() * (5 - 1)) + 1;
                }
                flower = this.returnFlower(tempAnswer, 0.3);
                break;
        }
        var minX = flower.getContentSize().width / 2 + 280;
        var maxX = this.winSize.width - flower.getContentSize().width / 2;
        var rangeX = maxX - minX;
        var actualX = Math.random() * rangeX + minX;
        var rangeDuration = this.maxDuration - this.minDuration;
        var actualDuration = Math.random() * rangeDuration + this.minDuration;
        flower.setPosition(cc.p(actualX, this.winSize.height + flower.getContentSize().height / 2));
        var actionMove = cc.MoveTo.create(actualDuration, cc.p(actualX, 0 - flower.getContentSize().height));
        var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinish, this);
        flower.runAction(cc.Sequence.create(actionMove, actionMoveDone));
        //flower.runAction(actionMove);
        this.addChild(flower, 1);
        this._flowers.push(flower);
    },
    //根据道具模式返回不同的花朵
    returnFlower: function (switchNumber, scaleNumber) {
        var flower;
        flower = cc.Sprite.create(this.missionPng[this.nowMissionNum - 1], cc.rect(this.flowerPosition[switchNumber-1][0], this.flowerPosition[switchNumber-1][1], this.flowerPosition[switchNumber-1][2], this.flowerPosition[switchNumber-1][3]));
        flower.setTag(switchNumber);
        flower.setScale(scaleNumber);
        return flower;
    },
    //添加道具
    addTools: function () {
        var tools;
        var randomNumber = Math.round(Math.random() * (4 - 1)) + 1;
        tools = cc.Sprite.create(MZB01tools, cc.rect(this.toolsPosition[randomNumber-1][0], this.toolsPosition[randomNumber-1][1], this.toolsPosition[randomNumber-1][2], this.toolsPosition[randomNumber-1][3]));
        tools.setTag(randomNumber + 5);
        var minX = tools.getContentSize().width / 2 + 280;
        var maxX = this.winSize.width - tools.getContentSize().width / 2;
        var rangeX = maxX - minX;
        var actualX = Math.random() * rangeX + minX;
        var rangeDuration = this.maxDuration - this.minDuration;
        var actualDuration = Math.random() * rangeDuration + this.minDuration;
        tools.setPosition(cc.p(actualX, this.winSize.height + tools.getContentSize().height / 2));
        var actionMove = cc.MoveTo.create(actualDuration, cc.p(actualX, 0 - tools.getContentSize().height));
        var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinish, this);
        tools.runAction(cc.Sequence.create(actionMove, actionMoveDone));
        this.addChild(tools, 1);
        this._tools.push(tools);
    },
    changeAnswer: function () {
        var changeAnswer = this.answer;
        while (changeAnswer == this.answer) {
            changeAnswer = Math.round(Math.random() * (5 - 1)) + 1;
        }
        this.answer = changeAnswer;
        this.removeChild(this.temp, true);
        this.temp = this.returnFlower(this.answer, 1.0);
        this.temp.setPosition(cc.p(this.origin.x + 180, this.origin.y + this.boy.getContentSize().height / 2 + 170));
        this.temp.setScale(0.7);
        this.addChild(this.temp, 1);
        this.gSharedEngine.playEffect(MZB01ChangeEffect);
    },
    timeCount: function () {
        this.time = this.time - 1;
        if (this.time == 0) {
            this.cleanup();
            this.gameOverBool = true;
            if (this.score < 1000) {
                this.starLevel = 0;
                this.gSharedEngine.playEffect(MZB01ClearNotPassEffect);
            }else if(this.score<2000){
                this.starLevel = 1;
                this.gSharedEngine.playEffect(MZB01ClearPassEffect);
            } else if (this.score < 3000) {
                this.starLevel = 2;
                this.gSharedEngine.playEffect(MZB01ClearPassEffect);
            } else {
                this.starLevel = 3;
                this.gSharedEngine.playEffect(MZB01ClearPassEffect);
            }
            //gameOverBG
            this.gameOver = cc.Sprite.create(gameOverBG, cc.rect(0, 0, 1920, 1080));
            this.gameOver.setScale(0.72);
            this.gameOver.setPosition(cc.p(this.origin.x + this.winSize._width / 2, this.origin.y + 768 / 2));
            this.addChild(this.gameOver, 5);
            //passWord
            if (this.starLevel != 0) {
                this.passWord = cc.Sprite.create(JZ01pass, cc.rect(0, 0, 586, 225));
            } else {
                this.passWord = cc.Sprite.create(JZ01passNot, cc.rect(0, 0, 587, 214));
            }
            this.passWord.setScale(0.72);
            this.passWord.setPosition(cc.p(this.winSize._width / 2, this.winSize._height - this.passWord.getContentSize().height / 2));
            this.addChild(this.passWord, 6);
            //stars
            var starsPosition = [[465, 440], [676, 470], [885, 440]];
            for (var i = 0; i < 3; i++) {
                var emptyStar = cc.Sprite.create(JZ01starEmpty, cc.rect(0, 0, 339, 347));
                emptyStar.setScale(0.72);
                emptyStar.setPosition(cc.p(starsPosition[i][0],starsPosition[i][1]));
                this.addChild(emptyStar, 6);
            }
            for (var i = 0; i < this.starLevel; i++) {
                var star = cc.Sprite.create(JZ01star, cc.rect(0, 0, 339, 347));
                star.setScale(0.072);
                star.setPosition(cc.p(starsPosition[i][0], starsPosition[i][1]));
                var actionBy = cc.ScaleBy.create(0.5, 10);
                var actionMoveDone = cc.CallFunc.create(this.playStar, this);
                star.runAction(cc.Sequence.create(actionBy,actionMoveDone));
                this.addChild(star, 6);
            }
            this.listControl = cc.MenuItemImage.create(
                JZ01list,
                JZ01listPress,
                this.returnMissionCallBack,
                this
            );
            this.listControl.setScale(0.72);
            this.listControl.setPosition(90, 170);
            this.replayControl = cc.MenuItemImage.create(
                JZ01replay,
                JZ01replayPress,
                this.replayCallBack,
                this
            );
            this.replayControl.setScale(0.72);
            this.replayControl.setPosition(290, 170);
            this.nextControl = cc.MenuItemImage.create(
                JZ01next,
                JZ01nextPress,
                this.returnMissionCallBack,
                this
            );
            this.nextControl.setScale(0.72);
            this.nextControl.setPosition(490, 170);
            this.menu2 = cc.Menu.create(this.listControl,this.replayControl,this.nextControl);
            this.menu2.setPosition(400, 0);
            this.addChild(this.menu2, 7);
            this.menu.setEnabled(false);
            if (this.starLevel != 0) {
                var progressBar = parseInt(this.MZB.values["progressBar"]);
                var mString;
                if (this.nowMissionNum < 10) {
                    mString = "M0" + parseInt((this.localSettings.values["lastGame"])["missionID"]);
                } else {
                    mString = "M" + parseInt((this.localSettings.values["lastGame"])["missionID"]);
                }
                var newVal = this.MZB01.values[mString];
                if (newVal["isFinish"] == false) {
                    newVal.insert("isFinish", true);
                    this.MZB01.values["lastestMission"] = parseInt((this.localSettings.values["lastGame"])["missionID"]);
                }
                if (this.score >= newVal["score"]) {
                    progressBar += parseInt((this.score - newVal["score"]) / 150);
                    if (progressBar >= 100) {
                        progressBar = progressBar - 100;
                        this.MZB.values["level"] = parseInt(this.MZB.values["level"]) + 1;
                    }
                    newVal.insert("score", this.score);
                    newVal.insert("starLevel", this.starLevel);
                }
                this.MZB01.values[mString] = newVal;
                this.MZB01.values["props"] = this.props.join();
                this.MZB.values["progressBar"] = progressBar;
            }            
            var testBroke = 1;
        }
        this.timeLabel.setString("Time : " + this.time);
    },
    updateGame: function () {
        var boyRect = this.boy.getBoundingBox();
        for (i in this._flowers) {
            var flower = this._flowers[i];
            var flowerRect = flower.getBoundingBox();
            if (cc.rectIntersectsRect(flowerRect, boyRect)) {                
                if (flower.getTag() == this.answer) {
                    if (this.combo < 5) {
                        this.combo++;
                        if (this.combo != 1) {
                            var comboSprite = cc.Sprite.create(this.comboPng[this.combo - 2], cc.rect(0, 0, this.comboPngSize[this.combo - 2][0], this.comboPngSize[this.combo - 2][1]));
                            var comboX = this.boy.getPositionX();
                            var comboY = this.boy.getPositionY();
                            comboSprite.setPosition(cc.p(comboX, comboY));
                            comboSprite.setScale(0.72);
                            var myTag = 40 + this.combo;
                            comboSprite.setTag(myTag);
                            this.addChild(comboSprite, 10);
                            var moveTo = cc.MoveTo.create(1, cc.p(comboX, comboY + 50));
                            var fadeTo = cc.FadeTo.create(1, 0);
                            var spawn = cc.Spawn.create(moveTo, fadeTo);
                            var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinish, this);
                            comboSprite.runAction(cc.Sequence.create(spawn, actionMoveDone));
                            if (this.combo == 5) {
                                this.fever = true;
                                this.scoreTime = 2;
                                this.scheduleOnce(function () {
                                    this.fever = false;
                                    this.scoreTime = 1;
                                    this.combo = 0;
                                }, 5);
                            }
                        }
                    }
                    this.score += (100*this.scoreTime);
                    this.gSharedEngine.playEffect(MZB01RightEffect);
                } else {
                    this.combo = 0;
                    this.score -= 100;
                    this.gSharedEngine.playEffect(MZB01BadEffect);
                }
                this.scoreLabel.setString("Score: " + this.score);
                this._flowers.splice(i, 1);
                this.removeChild(flower);
            }
        }
        for (j in this._tools) {
            var tools = this._tools[j];
            var toolsRect = tools.getBoundingBox();
            if (cc.rectIntersectsRect(toolsRect, boyRect)) {
                switch (tools.getTag()) {
                    case 6:
                        this.gSharedEngine.playEffect(MZB01FastEffect);
                        this.maxDuration = 2;
                        this.minDuration = 0.5;
                        this.scheduleOnce(function () {
                            this.maxDuration = 4;
                            this.minDuration = 2.5;
                        }, 5);
                        break;
                    case 7:
                        this.gSharedEngine.playEffect(MZB01GoodEffect);
                        this.addFlowerMode = 2;
                        this.scheduleOnce(function () {
                            this.addFlowerMode = 1;
                        }, 5);
                        break;
                    case 8:
                        this.gSharedEngine.playEffect(MZB01TimeEffect);
                        this.time += 5;
                        break;
                    case 9:
                        this.gSharedEngine.playEffect(MZB01BadEffect);
                        this.addFlowerMode = 3;
                        this.scheduleOnce(function () {
                            this.addFlowerMode = 1;
                        }, 5);
                        break;
                    default:
                        break;
                }
                this._tools.splice(j, 1);
                this.removeChild(tools);
            }
        }
    },
    spriteMoveFinish: function (sprite) {
        this.removeChild(sprite, true);
        if (sprite.getTag() == 1 || sprite.getTag() == 2 || sprite.getTag() == 3 || sprite.getTag() == 4 || sprite.getTag() == 5) {
            var index = this._flowers.indexOf(sprite);
            if (index > -1) {
                this._flowers.splice(index, 1);
            }
        } else if (sprite.getTag() == 6 || sprite.getTag() == 7 || sprite.getTag() == 8 || sprite.getTag() == 9) {
            var index = this._tools.indexOf(sprite);
            if (index > -1) {
                this._tools.splice(index, 1);
            }            
        }else if (sprite.getTag() == 100) {
            var index = this._bullets.indexOf(sprite);
            if (index > -1) {
                this._bullets.splice(index, 1);
            }
        }
    },
    playStar: function () {
        switch (this.starLevel) {
            case 0:
                this.gSharedEngine.playEffect(star0);
                break;
            case 1:
                this.gSharedEngine.playEffect(star1);
                break;
            case 2:
                this.gSharedEngine.playEffect(star2);
                break;
            case 3:
                this.gSharedEngine.playEffect(star3);
                break;
        }
    }
});
