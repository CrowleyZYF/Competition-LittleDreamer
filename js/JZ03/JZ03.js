var JZ03Layer = cc.LayerColor.extend({
    //现在关卡数
    nowMissionNumber: 1,
    cardMax: [1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3],
    cardPng: [JZ03a, JZ03b, JZ03c, JZ03d, JZ03e, JZ03f, JZ03g],
    canUsePng:[],
    cardSize: [[278, 305], [278, 305], [278, 305], [278, 305], [278, 305], [278, 305], [278, 305]],
    canUseSize: [],
    numberMax: [8, 8, 8, 8, 8, 8, 10, 10, 10, 8, 8, 8, 10, 10, 10],
    positions: [[337, 430], [622, 430], [905, 430], [1195, 430]],
    missionSprite: null,
    targetSprite: null,
    targetIndex: 0,
    total: 10,
    now: 0,
    waitAnswer: false,
    answer: 0,
    answerPosition: 0,
    gameOver: false,
    time: 90,
    score: 0,
    speed: 0.5,
    scoreAdd: 400,
                
    init: function () {

        this._super();

        this.winSize = cc.Director.getInstance().getWinSize();
        this.origin = cc.Director.getInstance().getVisibleOrigin();

        for (var i = 0; i < this.cardMax[this.nowMissionNumber - 1]; i++) {
            var unique = false;
            var randomIndex = Math.round(Math.random() * (this.cardPng.length - 1));
            while (!unique) {
                switch (this.canUsePng.length) {
                    case 0:
                        unique = true;
                        break;
                    case 1:
                        if (this.cardPng[randomIndex] == this.canUsePng[0]) {
                            randomIndex = Math.round(Math.random() * (this.cardPng.length - 1));
                        } else {
                            unique = true;
                        }
                        break;
                    case 2:
                        if (this.cardPng[randomIndex] == this.canUsePng[0] || this.cardPng[randomIndex] == this.canUsePng[1]) {
                            randomIndex = Math.round(Math.random() * (this.cardPng.length - 1));
                        } else {
                            unique = true;
                        }
                        break;
                }
            }
            this.canUsePng[i] = this.cardPng[randomIndex];
            this.canUseSize[i] = this.cardSize[randomIndex];
        }
        
        this.total = Math.round(Math.random() * (this.numberMax[this.nowMissionNumber] - 2)) + 2;

        this.speedUp = [false, false, false, false, false];
        this.speedUpIndex = 0;

        //background
        this.bg = cc.Sprite.create(JZ03BG, cc.rect(0, 0, 1920, 1080));
        this.bg.setScale(0.72);
        this.bg.setPosition(cc.p(683, 384));
        this.addChild(this.bg, 1);

        for (var i = 0; i < 4; i++) {
            var hatImg = cc.Sprite.create(hat, cc.rect(0, 0, 345, 154));
            hatImg.setScale(0.72);
            hatImg.setPosition(cc.p(this.positions[i][0], this.positions[i][1]));
            this.addChild(hatImg, 6);
        }

        this.targetIndex = Math.round(Math.random() * (this.canUsePng.length - 1));
        this.targetSprite = cc.Sprite.create(this.canUsePng[this.targetIndex], cc.rect(0, 0, this.canUseSize[this.targetIndex][0], this.canUseSize[this.targetIndex][1]));
        this.targetSprite.setPosition(cc.p(150, 220));
        this.targetSprite.setTag(101);
        this.targetSprite.setScale(0.72);
        this.addChild(this.targetSprite, 2);

        this.container = cc.Sprite.create(JZ03Container, cc.rect(0, 0, 301, 207));
        this.container.setPosition(cc.p(150, 80));
        this.container.setScale(0.72);
        this.addChild(this.container, 3);

        this.leftAnswer = cc.Sprite.create(JZ03Board, cc.rect(0, 0, 331, 320));
        this.leftAnswer.setPosition(cc.p(572, 180));
        this.leftAnswer.setScale(0.72);
        this.addChild(this.leftAnswer, 2);

        this.rightAnswer = cc.Sprite.create(JZ03Board, cc.rect(0, 0, 331, 320));
        this.rightAnswer.setPosition(cc.p(927, 180));
        this.rightAnswer.setScale(0.72);
        this.addChild(this.rightAnswer, 2);

        this.leftHat = cc.Sprite.create(JZ03BoardLock, cc.rect(0, 0, 331, 320));
        this.leftHat.setPosition(cc.p(572, 180));
        this.leftHat.setScale(0.72);
        this.addChild(this.leftHat, 4);

        this.rightHat = cc.Sprite.create(JZ03BoardLock, cc.rect(0, 0, 331, 320));
        this.rightHat.setPosition(cc.p(927, 180));
        this.rightHat.setScale(0.72);
        this.addChild(this.rightHat, 4);

        this.leftLabel = cc.LabelTTF.create(0, "myChinese", 120);
        this.leftLabel.setColor(cc.c4(122, 122, 122, 122));
        this.leftLabel.setPosition(cc.p(567, 185));
        this.addChild(this.leftLabel, 6);

        this.rightLabel = cc.LabelTTF.create(0, "myChinese", 120);
        this.rightLabel.setColor(cc.c4(122, 122, 122, 122));
        this.rightLabel.setPosition(cc.p(922, 185));
        this.addChild(this.rightLabel, 6);

        this.timeLabel = cc.LabelTTF.create("Time：" + this.time, "myEnglish", 50);
        this.timeLabel.setAnchorPoint(0, 0);
        this.timeLabel.setPosition(cc.p(280, 650));
        this.addChild(this.timeLabel, 3);

        this.scoreLabel = cc.LabelTTF.create("Score：" + this.score, "myEnglish", 50);
        this.scoreLabel.setAnchorPoint(0, 0);
        this.scoreLabel.setPosition(cc.p(690, 650));
        this.addChild(this.scoreLabel, 3);
        /*
        this.scoreAddLabel = cc.LabelTTF.create("scoreAdd：" + this.scoreAdd, "myChinese", 40);
        this.scoreAddLabel.setPosition(cc.p(227, 600));
        this.addChild(this.scoreAddLabel, 3);
        */

        this.pause = cc.MenuItemImage.create(
                            JZ03Pause,
                            JZ03PausePress,
                            this.returnMissionCallBack,
                            this
                        );
        this.pause.setScale(0.72);
        this.pause.setPosition(1320, 720);
        this.menu = cc.Menu.create(this.pause);
        this.menu.setPosition(0, 0);
        this.addChild(this.menu, 5);
                
        this.createRandomSprite();

        this.schedule(this.timeDiscount, 1);
        this.setTouchEnabled(true);
        return true;
    },
    
    returnMissionCallBack: function () {
        cc.Director.getInstance().pause();
        $("#Cocos2dGameContainer").css("display", "none");
        WinJS.Navigation.navigate("/pages/mission/mission.html");
    },

    createRandomSprite: function () {
        if (!this.gameOver) {
            if (this.now != 0) {
                this.removeChildByTag(100);
            }
            if (this.now < this.total) {
                this.now++;
                var randomIndex = Math.round(Math.random() * (this.canUsePng.length - 1));
                this.missionSprite = cc.Sprite.create(this.canUsePng[randomIndex], cc.rect(0, 0, this.canUseSize[randomIndex][0], this.canUseSize[randomIndex][1]));
                if (randomIndex == this.targetIndex) {
                    this.answer++;
                }
                var positionRandomIndex = Math.round(Math.random() * (this.positions.length - 1));
                this.missionSprite.setPosition(cc.p(this.positions[positionRandomIndex][0], this.positions[positionRandomIndex][1]));
                this.missionSprite.setScale(0.45);
                this.missionSprite.setTag(100);
                this.missionSprite.setOpacity(0);
                var fadeTo1 = cc.FadeTo.create(this.speed, 255);
                var moveTo1 = cc.MoveTo.create(this.speed, cc.p(this.positions[positionRandomIndex][0], this.positions[positionRandomIndex][1] + 100));
                var action1 = cc.Spawn.create(fadeTo1, moveTo1);
                var fadeTo2 = cc.FadeTo.create(this.speed, 0);
                var moveTo2 = cc.MoveTo.create(this.speed, cc.p(this.positions[positionRandomIndex][0], this.positions[positionRandomIndex][1] + 200));
                var action2 = cc.Spawn.create(fadeTo2, moveTo2);
                var actionMoveDone = cc.CallFunc.create(this.createRandomSprite, this);
                this.missionSprite.runAction(cc.Sequence.create(action1, action2, actionMoveDone));
                this.addChild(this.missionSprite, 5);
            } else {
                if (Math.random < 0.5) {
                    var left = this.answer;
                    var right = Math.round(Math.random() * (this.numberMax[this.nowMissionNumber - 1] - 1)) + 1;
                    while (right == left) {
                        var right = Math.round(Math.random() * (this.numberMax[this.nowMissionNumber - 1] - 1)) + 1;
                    }
                    this.answerPosition = 0;
                } else {
                    var right = this.answer;
                    var left = Math.round(Math.random() * (this.numberMax[this.nowMissionNumber - 1] - 1)) + 1;
                    while (right == left) {
                        var left = Math.round(Math.random() * (this.numberMax[this.nowMissionNumber - 1] - 1)) + 1;
                    }
                    this.answerPosition = 1;
                }

                this.leftLabel.setString(left);
                this.rightLabel.setString(right);

                this.leftHat.runAction(cc.FadeTo.create(0.5, 0));
                this.rightHat.runAction(cc.FadeTo.create(0.5, 0));

                this.waitAnswer = true;
            }
        }        
    },

    
    onTouchesMoved: function (touches, event) {
    },

    onTouchesEnded: function (touches, event) {
        if (this.onClickFlag) {
            var touch = touches[0];
            var location = touch.getLocation();
        }
    },

    onTouchesBegan: function (touches, event) {
        var touch = touches[0];
        var location = touch.getLocation();
        if (!(this.gameOver) && this.waitAnswer) {
            if ((cc.rectContainsPoint(cc.rect(465, 90, 201, 198), location) && this.answerPosition==0)||(cc.rectContainsPoint(cc.rect(821, 90, 201, 198), location) && this.answerPosition==1)) {
                this.waitAnswer = false;
                this.score += this.scoreAdd;
                this.scoreLabel.setString("Score：" + this.score);
                var rightSprite = cc.Sprite.create(JZ03Right, cc.rect(0, 0, 97, 93));
                switch(this.answerPosition){
                    case 0:
                        rightSprite.setPosition(cc.p(649, 105));
                        break;
                    case 1:
                        rightSprite.setPosition(cc.p(1005, 105));
                        break;
                }
                rightSprite.setScale(0.1);
                rightSprite.setOpacity(0);
                rightSprite.setTag(100);
                var scaleTo = cc.ScaleBy.create(0.5, 10);
                var fadeTo = cc.FadeTo.create(0.5, 255);
                rightSprite.runAction(cc.Spawn.create(scaleTo, fadeTo));
                this.addChild(rightSprite, 3);
                this.scheduleOnce(function () {
                    this.getChildByTag(100).runAction(cc.FadeTo.create(0.5, 0));
                }, 0.5)
                this.scheduleOnce(function () {
                    this.removeChildByTag(100);
                    this.removeChildByTag(101);

                    this.leftHat.runAction(cc.FadeTo.create(0.5, 255));
                    this.rightHat.runAction(cc.FadeTo.create(0.5, 255));
                    this.canUsePng = [];
                    this.canUseSize = [];
                    for (var i = 0; i < this.cardMax[this.nowMissionNumber - 1]; i++) {
                        var unique = false;
                        var randomIndex = Math.round(Math.random() * (this.cardPng.length - 1));
                        while (!unique) {
                            switch (this.canUsePng.length) {
                                case 0:
                                    unique = true;
                                    break;
                                case 1:
                                    if (this.cardPng[randomIndex] == this.canUsePng[0]) {
                                        randomIndex = Math.round(Math.random() * (this.cardPng.length - 1));
                                    } else {
                                        unique = true;
                                    }
                                    break;
                                case 2:
                                    if (this.cardPng[randomIndex] == this.canUsePng[0] || this.cardPng[randomIndex] == this.canUsePng[1]) {
                                        randomIndex = Math.round(Math.random() * (this.cardPng.length - 1));
                                    } else {
                                        unique = true;
                                    }
                                    break;
                            }
                        }
                        this.canUsePng[i] = this.cardPng[randomIndex];
                        this.canUseSize[i] = this.cardSize[randomIndex];
                    }
                    this.total = Math.round(Math.random() * (this.numberMax[this.nowMissionNumber] - 2)) + 2;

                    this.targetIndex = Math.round(Math.random() * (this.canUsePng.length - 1));
                    this.targetSprite = cc.Sprite.create(this.canUsePng[this.targetIndex], cc.rect(0, 0, this.canUseSize[this.targetIndex][0], this.canUseSize[this.targetIndex][1]));
                    this.targetSprite.setPosition(cc.p(150, 220));
                    this.targetSprite.setTag(101);
                    this.targetSprite.setScale(0.5);
                    this.addChild(this.targetSprite, 2);

                    this.now = 0;
                    this.answer = 0;
                    this.scoreAdd = 400;                    
                    this.createRandomSprite();
                }, 1)
            } else if ((cc.rectContainsPoint(cc.rect(465, 90, 201, 198), location) && this.answerPosition == 1) || (cc.rectContainsPoint(cc.rect(821, 90, 201, 198), location) && this.answerPosition == 0)) {
                this.waitAnswer = false;
                var wrongSprite = cc.Sprite.create(JZ03wrong, cc.rect(0, 0, 97, 93));
                switch (this.answerPosition) {
                    case 1:
                        wrongSprite.setPosition(cc.p(649, 105));
                        break;
                    case 0:
                        wrongSprite.setPosition(cc.p(1005, 105));
                        break;
                }
                wrongSprite.setScale(0.1);
                wrongSprite.setOpacity(0);
                wrongSprite.setTag(100);
                var scaleTo = cc.ScaleBy.create(0.5, 10);
                var fadeTo = cc.FadeTo.create(0.5, 255);
                wrongSprite.runAction(cc.Spawn.create(scaleTo, fadeTo));
                this.addChild(wrongSprite, 3);
                this.scheduleOnce(function () {
                    this.getChildByTag(100).runAction(cc.FadeTo.create(0.5, 0));
                }, 0.5)
                this.scheduleOnce(function () {
                    this.removeChildByTag(100);
                    this.removeChildByTag(101);

                    this.leftHat.runAction(cc.FadeTo.create(0.5, 255));
                    this.rightHat.runAction(cc.FadeTo.create(0.5, 255));

                    for (var i = 0; i < this.cardMax[this.nowMissionNumber - 1]; i++) {
                        var randomIndex = Math.round(Math.random() * (this.cardPng.length - 1));
                        this.canUsePng[i] = this.cardPng[randomIndex];
                        this.canUseSize[i] = this.cardSize[randomIndex];
                    }
                    this.total = Math.round(Math.random() * (this.numberMax[this.nowMissionNumber] - 2)) + 2;

                    this.targetIndex = Math.round(Math.random() * (this.canUsePng.length - 1));
                    this.targetSprite = cc.Sprite.create(this.canUsePng[this.targetIndex], cc.rect(0, 0, this.canUseSize[this.targetIndex][0], this.canUseSize[this.targetIndex][1]));
                    this.targetSprite.setPosition(cc.p(150, 220));
                    this.targetSprite.setTag(101);
                    this.targetSprite.setScale(0.5);
                    this.addChild(this.targetSprite, 2);

                    this.now = 0;
                    this.answer = 0;
                    this.scoreAdd = 400;
                    this.createRandomSprite();
                }, 1)
            }
        }
    },

    timeDiscount: function () {
        this.time--;
        this.timeLabel.setString("Time：" + this.time);
        if (this.waitAnswer && this.scoreAdd != 100) {
            this.scoreAdd -= 100;
        }
        //this.scoreAddLabel.setString("scoreAdd：" + this.scoreAdd);
        if (this.waitAnswer && ((this.time < 75&&this.speedUp[0]==false) || (this.time < 60&&this.speedUp[1]==false) || (this.time < 45&&this.speedUp[2]==false) || (this.time < 30&&this.speedUp[3]==false) || (this.time < 15&&this.speedUp[4]==false))) {
            this.speed -= 0.05;
            this.speedUp[this.speedUpIndex] = true;
            this.speedUpIndex++;
        }
        if (this.time == 0) {
            this.gameOver = true;
            this.cleanup();            
        }
    }
});