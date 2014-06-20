var JZ02Layer = cc.LayerColor.extend({
    //现在关卡数
    nowMissionNumber: 1,
    rightCount: 0,
    //4维数组，点击的点位，第一维是X关卡的相关所有的数据，第二维是X关卡的第X问的所有答案的点位，第三维就是点位，第43维就是具体的数据
    missionsAnswerPosition: [
        //第一关
        [
            //第一问，熊猫
            [
                [153, 20, 92, 95], [1095, 95, 95, 104], [1234, 136, 93, 99], [800, 375, 82, 104]
            ],
            //第二问，长颈鹿
            [
                [342, 20, 101, 137], [789, 175, 108, 141], [988, 414, 121, 152], [318, 357, 84, 138]
            ],
            //第三问，奶牛
            [
                [587, 33, 171, 150], [511, 364, 147, 153]
            ],
            //第四问，小鱼
            [
                [187, 157, 102, 67], [320, 221, 103, 54], [559, 206, 100, 58], [1031, 290, 129, 67], [1224, 322, 101, 61]
            ]
        ]        
    ],
    missionsAnswerAudio: [
        //第一关
        [
            JZ02a, JZ02c, JZ02d, JZ02b
        ]
    ],
    missionsImg: [
        //第一关
        [
            JZ02Mission1Img0, JZ02Mission1Img1, JZ02Mission1Img2, JZ02Mission1Img3
        ]
    ],
    numberAudio: [JZ02Number1, JZ02Number2, JZ02Number3, JZ02Number4, JZ02Number5, JZ02Number6, JZ02Number7, JZ02Number8, JZ02Number9],
    numberImg: [JZ02Number0Img, JZ02Number1Img, JZ02Number2Img, JZ02Number3Img, JZ02Number4Img, JZ02Number5Img, JZ02Number6Img, JZ02Number7Img, JZ02Number8Img, JZ02Number9Img],
    questioned: [],
    questionedNumber: 0,
    clicked: [],
    randomQuestion: 0,
    gameOver: false,
    scoreAdd: 1000,
    score: 0,
    timeTest: 0,
    tipBool: false,
    tipIndex: 0,
    tipSprite: null,
    offsetX: 44, 
    offsetY: 31,

    init: function () {

        this._super();

        this.winSize = cc.Director.getInstance().getWinSize();
        this.origin = cc.Director.getInstance().getVisibleOrigin();

        //background
        this.bg = cc.Sprite.create(JZ02BG, cc.rect(0, 0, 1920, 1080));
        this.bg.setScale(0.72);
        this.bg.setPosition(cc.p(this.origin.x + this.winSize._width / 2, this.origin.y + this.winSize._height / 2));
        this.addChild(this.bg, 1);

        this.missionImg = cc.Sprite.create(JZ02Mission1, cc.rect(0, 0, 1397, 858));
        this.missionImg.setAnchorPoint(0, 0)
        this.missionImg.setScale(0.72);
        this.missionImg.setPosition(cc.p(44, 31));
        this.addChild(this.missionImg, 2);

        this.container = cc.Sprite.create(JZ02Container, cc.rect(0, 0, 1521, 904));
        this.container.setAnchorPoint(0, 0)
        this.container.setScale(0.72);
        this.container.setPosition(cc.p(0, 11));
        this.addChild(this.container, 3);

        this.scoreLabel = cc.LabelTTF.create("Score：" + this.score, "myEnglish", 60);
        this.scoreLabel.setAnchorPoint(0, 0);
        this.scoreLabel.setPosition(cc.p(220, 650));
        this.addChild(this.scoreLabel, 2);

        this.numberBG = cc.Sprite.create(JZ02NumberBG, cc.rect(0, 0, 452, 359));
        this.numberBG.setScale(0.7);
        this.numberBG.setPosition(1210, 500);
        this.addChild(this.numberBG, 2);

        this.targetBG = cc.Sprite.create(JZ02TargetBG, cc.rect(0, 0, 472, 441));
        this.targetBG.setScale(0.7);
        this.targetBG.setPosition(1210, 180);
        this.addChild(this.targetBG, 2);


        this.showTip = cc.MenuItemImage.create(
                            JZ02Tip,
                            JZ02TipPress,
                            this.showTipCallBack,
                            this
                        );
        this.showTip.setScale(0.72);
        this.showTip.setPosition(1250, 720);
        this.pause = cc.MenuItemImage.create(
                            JZ02Pause,
                            JZ02PausePress,
                            this.returnMissionCallBack,
                            this
                        );
        this.pause.setScale(0.72);
        this.pause.setPosition(1320, 720);
        this.menu = cc.Menu.create(this.showTip, this.pause);
        this.menu.setPosition(0, 0);
        this.addChild(this.menu, 5);
        /*
        this.timeTestLabel = cc.LabelTTF.create("Time：" + this.timeTest + "秒", "myChinese", 30);
        this.timeTestLabel.setAnchorPoint(0, 0);
        this.timeTestLabel.setPosition(cc.p(650, 680));
        this.addChild(this.timeTestLabel, 2);

        this.scoreAddLabel = cc.LabelTTF.create("scoreAdd：" + this.scoreAdd, "myChinese", 30);
        this.scoreAddLabel.setAnchorPoint(0, 0);
        this.scoreAddLabel.setPosition(cc.p(850, 680));
        this.addChild(this.scoreAddLabel, 2);
        */
        

        //init questioned
        this.questioned = [];
        for (var i = 0; i < this.missionsAnswerPosition[this.nowMissionNumber - 1].length; i++) {
            this.questioned[i] = false;
        }
         
        this.gSharedEngine = cc.AudioEngine.getInstance();
        this.gSharedEngine.init();
        this.gSharedEngine.setMusicVolume(1);
        this.gSharedEngine.setEffectsVolume(1);

        this.randomQuestion = Math.round(Math.random() * (this.missionsAnswerPosition[this.nowMissionNumber - 1].length - 1));
        this.questioned[this.randomQuestion] = true;
        this.questionedNumber++;
        if (this.rightCount == 0) {
            this.number = cc.Sprite.create(this.numberImg[this.rightCount], cc.rect(0, 0, 123, 161));
            this.number.setScale(0.72);
        } else {
            this.number = cc.Sprite.create(this.numberImg[this.rightCount], cc.rect(0, 0, 205, 264));
            this.number.setScale(0.52);
        }      
        this.number.setPosition(1210, 500);
        this.number.setTag(200);
        this.addChild(this.number, 2);

        this.target = cc.Sprite.create(this.missionsImg[this.nowMissionNumber - 1][this.randomQuestion], cc.rect(0, 0, 211, 209));
        this.target.setScale(0.72);
        this.target.setPosition(1220, 200);
        this.target.setTag(201);
        this.addChild(this.target, 2);
        this.gSharedEngine.playEffect(this.missionsAnswerAudio[this.nowMissionNumber - 1][this.randomQuestion]);

        this.clicked = [];
        for (var i = 0; i < this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion].length; i++) {
            this.clicked[i] = false;
        }

        this.schedule(this.changeTime, 1);

        this.setTouchEnabled(true);
        return true;
    },

    returnMissionCallBack: function () {
        cc.Director.getInstance().pause();
        $("#Cocos2dGameContainer").css("display", "none");
        WinJS.Navigation.navigate("/pages/mission/mission.html");
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
        if (!(this.gameOver)) {
            for (var i = 0; i < this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion].length; i++) {
                if (this.clicked[i] == false && cc.rectContainsPoint(cc.rect(this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion][i][0] * 0.72 + this.offsetX, this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion][i][1] * 0.72 + this.offsetY, this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion][i][2] * 0.72, this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion][i][3] * 0.72), location)) {
                    if (this.tipBool && i == this.tipIndex) {
                        var scaleTo = cc.ScaleBy.create(0.5, 0.1);
                        var fadeTo = cc.FadeTo.create(0.5, 0);
                        this.tipSprite.runAction(cc.Spawn.create(scaleTo, fadeTo));
                        this.scheduleOnce(function () {
                            this.removeChildByTag(100);
                            this.tipBool = false;
                        }, 0.5);
                    }
                    this.clicked[i] = true;
                    this.rightCount++;
                    this.removeChildByTag(200);
                    this.number = cc.Sprite.create(this.numberImg[this.rightCount], cc.rect(0, 0, 205, 264));
                    this.number.setScale(0.52);
                    this.number.setPosition(1210, 500);
                    this.number.setTag(200);
                    this.addChild(this.number, 2);
                    this.score += this.scoreAdd;
                    this.scoreAdd = 1000;                    
                    //this.scoreAddLabel.setString("scoreAdd：" + this.scoreAdd);
                    this.scoreLabel.setString("Score：" + this.score);
                    var rightSprite = cc.Sprite.create(JZ02Right, cc.rect(0, 0, 77, 93));
                    rightSprite.setPosition(cc.p(parseInt((this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion][i][0] + 0.5 * this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion][i][2]) * 0.72 + this.offsetX), parseInt((this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion][i][1] + 0.5 * this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion][i][3])) * 0.72 + this.offsetY));
                    rightSprite.setScale(0.1);
                    rightSprite.setOpacity(0);
                    var scaleTo = cc.ScaleBy.create(0.5, 7.2);
                    var fadeTo = cc.FadeTo.create(0.5, 255);
                    rightSprite.runAction(cc.Spawn.create(scaleTo, fadeTo));
                    this.addChild(rightSprite, 4);
                    this.gSharedEngine.playEffect(this.numberAudio[this.rightCount - 1]);
                    if (this.rightCount == this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion].length) {
                        if (this.questionedNumber == this.missionsAnswerPosition[this.nowMissionNumber - 1].length) {
                            //this.gSharedEngine.playEffect(this.numberAudio[9]);
                            this.gameOver = true;
                            this.scheduleOnce(function () {
                                this.cleanup();
                                this.gSharedEngine.stopAllEffects();
                                if (this.score < 3000) {
                                    this.starLevel = 0;
                                    this.gSharedEngine.playEffect(star0);
                                } else if (this.score < 6000) {
                                    this.starLevel = 1;
                                    this.gSharedEngine.playEffect(star1);
                                } else if (this.score < 9000) {
                                    this.starLevel = 2;
                                    this.gSharedEngine.playEffect(star2);
                                } else {
                                    this.starLevel = 3;
                                    this.gSharedEngine.playEffect(star3);
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
                                    emptyStar.setPosition(cc.p(starsPosition[i][0], starsPosition[i][1]));
                                    this.addChild(emptyStar, 6);
                                }
                                for (var i = 0; i < this.starLevel; i++) {
                                    var star = cc.Sprite.create(JZ01star, cc.rect(0, 0, 339, 347));
                                    star.setScale(0.072);
                                    star.setPosition(cc.p(starsPosition[i][0], starsPosition[i][1]));
                                    var actionBy = cc.ScaleBy.create(0.5, 10);
                                    star.runAction(actionBy);
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
                                    this.returnMissionCallBack,
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
                                this.menu2 = cc.Menu.create(this.listControl, this.replayControl, this.nextControl);
                                this.menu2.setPosition(400, 0);
                                this.addChild(this.menu2, 7);
                            }, 2);
                        } else {
                            this.questionedNumber++;
                            this.randomQuestion = Math.round(Math.random() * (this.missionsAnswerPosition[this.nowMissionNumber - 1].length - 1));
                            while (this.questioned[this.randomQuestion] == true) {
                                this.randomQuestion = Math.round(Math.random() * (this.missionsAnswerPosition[this.nowMissionNumber - 1].length - 1));
                            }
                            this.scheduleOnce(function () {
                                this.gSharedEngine.playEffect(this.missionsAnswerAudio[this.nowMissionNumber - 1][this.randomQuestion]);
                            }, 1.5);
                            this.questioned[this.randomQuestion] = true;
                            this.clicked = [];
                            for (var i = 0; i < this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion].length; i++) {
                                this.clicked[i] = false;
                            }
                            this.rightCount = 0;

                            //this.removeChildByTag(200);
                            this.removeChildByTag(201);
                            /*
                            this.number = cc.Sprite.create(this.numberImg[this.rightCount], cc.rect(0, 0, 123, 161));
                            this.number.setScale(0.72);
                            this.number.setPosition(1210, 500);
                            this.number.setTag(200);
                            this.addChild(this.number, 2);
                            */

                            this.target = cc.Sprite.create(this.missionsImg[this.nowMissionNumber - 1][this.randomQuestion], cc.rect(0, 0, 211, 209));
                            this.target.setScale(0.72);
                            this.target.setPosition(1220, 200);
                            this.target.setTag(201);
                            this.addChild(this.target, 2);
                        }
                    }
                }
            }
        }                
    },

    changeTime: function () {
        this.timeTest++;
        //this.timeTestLabel.setString("Time：" + this.timeTest + "秒");
        if (this.scoreAdd != 100) {
            this.scoreAdd -= 100;
        }
        //this.scoreAddLabel.setString("scoreAdd：" + this.scoreAdd);
    },

    showTipCallBack: function () {
        if (!this.tipBool) {
            this.tipBool = true;
            this.tipIndex = Math.round(Math.random() * (this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion].length - 1));
            while (this.clicked[this.tipIndex] == true) {
                this.tipIndex = Math.round(Math.random() * (this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion].length - 1));
            }
            this.tipSprite = cc.Sprite.create(JZ02TipTool, cc.rect(0, 0, 69, 108));
            this.tipSprite.setTag(100);
            this.tipSprite.setPosition(cc.p(parseInt(this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion][this.tipIndex][0] + 0.5 * this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion][this.tipIndex][2]) * 0.72 + this.offsetX, parseInt(this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion][this.tipIndex][1] + 0.5 * this.missionsAnswerPosition[this.nowMissionNumber - 1][this.randomQuestion][this.tipIndex][3]) * 0.72 + this.offsetY));
            this.tipSprite.setScale(0.5);
            //this.tipSprite.setOpacity(0);
            this.tipSprite.setOpacity(200);
            var scaleTo = cc.ScaleBy.create(0.5, 7.2);
            var fadeTo = cc.FadeTo.create(0.5, 255);
            var Blink = cc.Blink.create(2, 8);
            this.tipSprite.runAction(cc.Sequence.create(Blink));
            this.addChild(this.tipSprite, 4);
        }        
    },

    returnMissionCallBack: function () {
        cc.Director.getInstance().pause();
        $("#Cocos2dGameContainer").css("display", "none");
        WinJS.Navigation.navigate("/pages/mission/mission.html");
    }
});