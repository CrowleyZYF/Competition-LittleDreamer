var MZH01Layer = cc.LayerColor.extend({
    targetIndex: 1,
    targetPng: [star1Big, star2Big, star3Big, star4Big, star5Big, star6Big, star7Big, star8Big],
    timeCount: 15,




    init: function () {

        this._super();
        this._fire = [];
        
        this.winSize = cc.Director.getInstance().getWinSize();
        this.origin = cc.Director.getInstance().getVisibleOrigin();

        //background
        this.bg = cc.Sprite.create(MZB01BG, cc.rect(0, 0, 1366, 768));
        this.bg.setPosition(cc.p(this.origin.x + this.winSize._width / 2, this.origin.y + this.bg.getContentSize().height / 2));
        this.addChild(this.bg, 1);

        this.starWay = cc.Sprite.create(starWay, cc.rect(0, 0, 752, 752));
        this.starWay.setPosition(cc.p(this.origin.x + this.starWay.getContentSize().width / 2 + 30, this.origin.y + this.starWay.getContentSize().height / 2));
        this.addChild(this.starWay, 1);

        this.sun = cc.Sprite.create(star0Img, cc.rect(0, 0, 48, 48));
        this.sun.setPosition(cc.p(this.origin.x + this.starWay.getContentSize().width / 2 + 30, this.origin.y + this.starWay.getContentSize().height / 2));
        this.addChild(this.sun, 1);

        this.addStar(1, star1Img, 10, 5, 4.8, this);
        this.addStar(2, star2Img, 16, 8, 5.1, this);
        this.addStar(3, star3Img, 16, 12, 7.2, this);
        this.addStar(4, star4Img, 14, 20, 10.3, this);
        this.addStar(5, star5Img, 30, 30, 6.2, this);
        this.addStar(6, star6Img, 26, 60, 8.3, this);
        this.addStar(7, star7Img, 20, 70, 12.2, this);
        this.addStar(8, star8Img, 20, 100, 13.8, this);

        this.target = cc.Sprite.create(this.targetPng[this.targetIndex - 1], cc.rect(0, 0, 256, 256));
        this.target.setPosition(cc.p(900, 600));
        this.target.setScale(0.5);
        var rotate = cc.RotateBy.create(3, 360);
        var action = cc.RepeatForever.create(rotate);
        this.target.runAction(action);
        this.addChild(this.target, 1);

        this.timeCountLabel = cc.LabelTTF.create("时空隧道关闭倒计时：" + this.timeCount + "秒", "myChinese", 30);
        this.timeCountLabel.setAnchorPoint(0, 0);
        this.timeCountLabel.setPosition(cc.p(850, 680));
        this.addChild(this.timeCountLabel, 2);

        this.info = cc.LabelTTF.create("火星遇袭", "myChinese", 60);
        this.info.setPosition(cc.p(1100, 600));
        this.addChild(this.info, 2);

        this.enemyLabel = cc.LabelTTF.create("敌人：", "myChinese", 30);
        this.enemyLabel.setAnchorPoint(0, 0);
        this.enemyLabel.setPosition(cc.p(850, 480));
        this.addChild(this.enemyLabel, 2);

        this.enemy = cc.Sprite.create(enemyLeftImg, cc.rect(0, 0, 193, 93));
        this.enemy.setPosition(cc.p(1030, 500));
        this.addChild(this.enemy, 2);

        this.addStarInfo(this.starInfo0, star0Img, 48, 850, 350, this.starInfo0Label, "太阳", 900, 350, this);
        this.addStarInfo(this.starInfo1, star1Img, 10, 1000, 350, this.starInfo1Label, "水星", 1050, 350, this);
        this.addStarInfo(this.starInfo2, star2Img, 16, 1150, 350, this.starInfo2Label, "金星", 1200, 350, this);
        this.addStarInfo(this.starInfo3, star3Img, 16, 850, 250, this.starInfo3Label, "地球", 900, 250, this);
        this.addStarInfo(this.starInfo4, star4Img, 14, 1000, 250, this.starInfo4Label, "火星", 1050, 250, this);
        this.addStarInfo(this.starInfo5, star5Img, 30, 1150, 250, this.starInfo5Label, "木星", 1200, 250, this);
        this.addStarInfo(this.starInfo6, star6Img, 26, 850, 150, this.starInfo6Label, "土星", 900, 150, this);
        this.addStarInfo(this.starInfo7, star7Img, 20, 1000, 150, this.starInfo7Label, "天王星", 1050, 150, this);
        this.addStarInfo(this.starInfo8, star8Img, 20, 1150, 150, this.starInfo8Label, "海王星", 1200, 150, this);        

        this.schedule(this.countDown, 1);
        this.schedule(this.addFire, 0.3);
        this.scheduleOnce(function () {
            this.lock = cc.Sprite.create(lockImg, cc.rect(504, 671, 51, 51));
            this.lock.setPosition((this.getChildByTag(1)).getPositionX(), (this.getChildByTag(1)).getPositionY());
            this.lock.setAnchorPoint(1.34, 1.34);
            this.lock.setRotation((this.getChildByTag(1)).getRotationX());
            var rotate = cc.RotateBy.create(2, 144);
            var fadeIn = cc.FadeIn.create(1.0);
            var fadeOut = cc.FadeOut.create(1.0);
            var fade = cc.Sequence.create(fadeIn, fadeOut);
            var together = cc.Spawn.create(rotate, fade);
            var action = cc.RepeatForever.create(together);
            this.lock.runAction(action);
            this.addChild(this.lock, 5);
        }, 0.002)

        this.setTouchEnabled(true);
        return true;
    },

    onTouchesMoved: function (touches, event) {
    },

    onTouchesEnded: function (touches, event) {
        if (this.onClickFlag) {
            var touch = touches[0];
            var location = touch.getLocation();
            if (cc.rectContainsPoint(this.lock.getBoundingBox(), location)) {
                this.onClickFlag = false;
                cc.Director.getInstance().pause();
                $("#Cocos2dGameContainer").css("display", "none");
                $("#Cocos2dGameContainer").css("display", "block");
                cc.Director.getInstance().resume();
                var nextScene = cc.Scene.create();
                var nextLayer = new MZH01AnotherLayer;
                nextScene.addChild(nextLayer);
                nextLayer.init();
                cc.Director.getInstance().replaceScene(nextScene);
            }
        }               
    },

    onTouchesBegan: function (touches, event) {
        var touch = touches[0];
        var location = touch.getLocation();
        if (cc.rectContainsPoint(this.lock.getBoundingBox(), location)) {
            this.onClickFlag = true;
        }
    },

    addStar: function (tag, starPNG, starRadius, rotateTime, anchorPoint, layer) {
        var star = cc.Sprite.create(starPNG, cc.rect(0, 0, starRadius, starRadius));
        star.setPosition(cc.p(this.origin.x + this.starWay.getContentSize().width / 2 + 30, this.origin.y + this.starWay.getContentSize().height / 2));
        var rotateTo = cc.RotateTo.create(0.001, Math.round(Math.random() * (180 - 1)) + 1);
        var actionMoveDone = cc.CallFunc.create(this.randomMoveFinish, this, rotateTime);        
        star.setAnchorPoint(anchorPoint, anchorPoint);
        star.runAction(cc.Sequence.create(rotateTo, actionMoveDone));
        star.setTag(tag);
        layer.addChild(star, 2);
    },

    addStarInfo: function(star, starPNG, starRadius, positionX, positionY, starLabel, labelContent, labelX, labelY, layer){
        star = cc.Sprite.create(starPNG, cc.rect(0, 0, starRadius, starRadius));
        star.setPosition(cc.p(positionX,positionY));
        layer.addChild(star, 2);
        starLabel = cc.LabelTTF.create(labelContent, "myChinese", 25);
        starLabel.setPosition(cc.p(labelX, labelY));
        starLabel.setAnchorPoint(0, 0.5);
        layer.addChild(starLabel, 2);
    },

    randomMoveFinish: function (sprite, rotateTime) {
        var rotate = cc.RotateBy.create(rotateTime, 360);
        var action = cc.RepeatForever.create(rotate);
        sprite.runAction(action);

    },

    countDown: function () {
        this.timeCount--;
        this.timeCountLabel.setString("时空隧道关闭倒计时：" + this.timeCount + "秒");
    },

    addFire: function () {
        var fire = cc.Sprite.create(fireImg15, cc.rect(0, 0, 74, 75));
        fire.setPosition(cc.p(1150, 500));
        fire.setScale(0.5);
        var move = cc.MoveTo.create(1, cc.p(1366 + fire.getContentSize().width / 2, 500));
        var moveDone = cc.CallFunc.create(this.deleteFire, this);
        fire.runAction(cc.Sequence.create(move, moveDone));
        this._fire.push(fire);
        this.addChild(fire, 2);
    },

    deleteFire: function (sprite) {
        this.removeChild(sprite, true);
        var index = this._fire.indexOf(sprite);
        if (index > -1) {
            this._fire.splice(index, 1);
        }
    }
});

var MZH01AnotherLayer = cc.LayerColor.extend({
    //现在的关卡
    nowMission: 15,
    //行星index
    targetIndex: 1,
    //八大行星
    targetPng: [star1Big, star2Big, star3Big, star4Big, star5Big, star6Big, star7Big, star8Big],
    //不同的火力
    fireImg: [fireImg1, fireImg2, fireImg3, fireImg4, fireImg5, fireImg6, fireImg7, fireImg8, fireImg9, fireImg10, fireImg10, fireImg12, fireImg13, fireImg14, fireImg15],
    //不同的火力大小
    fireImgSize: [[73, 44], [87, 83], [106, 65], [117, 69], [82, 28], [65, 58], [138, 68], [76, 49], [59, 65], [59, 43], [74, 63], [171, 121], [159, 112], [111, 100], [74, 75]],
    //黑洞位置
    blackHolePosition: [[125, 100], [375, 100], [625, 100], [875, 100], [1125, 100], [125, 300], [375, 300], [875, 300], [1125, 300], [125, 500], [375, 500], [625, 500], [875, 500], [1125, 500]],
    //导弹发射位置
    firePosition: [[125, 100], [375, 100], [625, 100], [875, 100], [1125, 100], [125, 300], [375, 300], [875, 300], [1125, 300], [125, 500], [375, 500], [625, 500], [875, 500], [1125, 500]],
    //敌机旋转角度
    enemyRotate: [340, 320, 290, 50, 30, 0, 0, 0, 0, 20, 40, 290, 320],
    //敌机左右
    enemyLeft: [true, true, true, false, false, true, true, false, false, true, true, false, false, false],
    //黑洞位置上是否有敌机
    hasEnemy: [false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    //敌机是否允许被摧毁
    //canDestory: [false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    //目前允许的敌机上线
    enemyMax: 4,
    //倒计时
    timeCount: 60,
    //分数
    score: 0,
    //目前导弹
    _fire: [],
    //导弹是否击中目标
    _bong: [],
    //敌机的位置
    //_enemy: [],
    _enemyDisappear: [],
    //行星血量
    hp: 100000,
    //boss是否出现
    boss: false,
    //boss的hp
    bossHP: 30,
    //是否gameOver
    gameOver: false,
    //boss出现的动画是否结束
    bossA: false,
    //boss分数的倍率
    bossScore: 6,
        
    init: function () {

        this._super();

        this.winSize = cc.Director.getInstance().getWinSize();
        this.origin = cc.Director.getInstance().getVisibleOrigin();

        this._fire = [];
        this._bong = [];
        this._enemyDisappear = [];
        this.hasEnemy = [false, false, false, false, false, false, false, false, false, false, false, false, false, false];

        var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        spriteFrameCache.addSpriteFrames("/images/baseResource.plist", "/images/baseResource.png");
        var gSpriteFrameCache = cc.SpriteFrameCache.getInstance();

        this.mDestroyFrames = [];
        var frame;
        for (var i = 0; i < 18; i++) {
            frame = gSpriteFrameCache.getSpriteFrame("pattern_destroy_" + ("00" + i).slice(-2) + ".png");
            this.mDestroyFrames.push(frame);
        }
        this.mExplodeFrames = [];
        for (var i = 0; i < 17; i++) {
            frame = gSpriteFrameCache.getSpriteFrame("pattern_explode_" + ("00" + i).slice(-2) + ".png");
            this.mExplodeFrames.push(frame);
        }

        this.gSharedEngine = cc.AudioEngine.getInstance();
        this.gSharedEngine.setMusicVolume(1);
        this.gSharedEngine.setEffectsVolume(1);

        //background
        this.bg = cc.Sprite.create(MZH01BG, cc.rect(0, 0, 1920, 1080));
        this.bg.setScale(0.72);
        this.bg.setPosition(cc.p(683, 384));
        this.bg.setTag(100);
        this.addChild(this.bg, 1);

        this.target = cc.Sprite.create(this.targetPng[2], cc.rect(0, 0, 256, 256));
        this.target.setPosition(cc.p(625, 300));
        this.target.setTag(100);
        var rotate = cc.RotateBy.create(3, 360);
        var action = cc.RepeatForever.create(rotate);
        this.target.runAction(action);
        this.addChild(this.target, 4);

        for (var i = 0; i < this.blackHolePosition.length; i++) {
            var blackHole = cc.Sprite.create(blackHoleImg, cc.rect(0, 0, 256, 256));
            blackHole.setPosition(cc.p(this.blackHolePosition[i][0], this.blackHolePosition[i][1]));
            blackHole.setScale(0.7);
            var actionBy1 = cc.FadeTo.create(0.3, 200);
            var actionBy2 = cc.FadeTo.create(0.3, 255);
            var action2 = cc.Sequence.create(actionBy1, actionBy2);
            var repeat = cc.RepeatForever.create(action2);
            blackHole.runAction(repeat);
            this.addChild(blackHole, 2);
        }

        for (var i = 0; i < this.enemyMax; i++) {
            //随机出来一个位置，且该位置没有敌机
            var randomPosition = Math.round(Math.random() * (14 - 1));
            //为true代表了有敌机，继续随机没有敌机的位置
            while (this.hasEnemy[randomPosition] == true) {
                randomPosition = Math.round(Math.random() * (14 - 1));
            }
            var enemy;
            if (this.enemyLeft[randomPosition]) {
                enemy = cc.Sprite.create(enemyLeftImg, cc.rect(0, 0, 193, 93));
            } else {
                enemy = cc.Sprite.create(enemyRightImg, cc.rect(831, 0, 193, 93));
            }
            enemy.setPosition(cc.p(this.blackHolePosition[randomPosition][0], this.blackHolePosition[randomPosition][1]));
            enemy.setScale(0.7);
            enemy.setTag(randomPosition);
            enemy.setRotation(this.enemyRotate[randomPosition]);
            enemy.canDestory = true;
            enemy.fire = 2;
            this.addChild(enemy, 3);
            enemy.scheduleOnce(function () {
                this.canDestory = false;
                var FadeTo = cc.FadeTo.create(0.5, 0);
                var enemyDisappear = cc.CallFunc.create(this.getParent().enemyDisappear, this, this.getTag());
                this.runAction(cc.Sequence.create(FadeTo, enemyDisappear));
            }, 4);
            enemy.schedule(function () {
                var fire = cc.Sprite.create(this.getParent().fireImg[this.getParent().nowMission - 1], cc.rect(0, 0, this.getParent().fireImgSize[this.getParent().nowMission - 1][0], this.getParent().fireImgSize[this.getParent().nowMission - 1][1]));
                fire.setPosition(cc.p(this.getParent().firePosition[this.getTag()][0], this.getParent().firePosition[this.getTag()][1]));
                fire.setScale(0.5);
                var flyTime = 0.2;
                while (flyTime < 0.5) {
                    flyTime = Math.random();
                }
                var move = cc.MoveTo.create(flyTime, cc.p(625, 300));
                var moveDone = cc.CallFunc.create(this.getParent().deleteFire, fire);
                fire.runAction(cc.Sequence.create(move, moveDone));
                this.getParent()._fire.push(fire);
                this.getParent()._bong.push(false);
                this.getParent().addChild(fire, 2);
            }, 1);
            //某位置上有敌机了，同时该敌机目前可以被摧毁，但4秒之后就会逐渐变淡消失，变得不可摧毁
            this.hasEnemy[randomPosition] = true;
        };

        this.timeCountLabel = cc.LabelTTF.create("Time: " + this.timeCount + "秒", "myChinese", 30);
        this.timeCountLabel.setAnchorPoint(0, 0);
        this.timeCountLabel.setPosition(cc.p(850, 680));
        this.timeCountLabel.setTag(100);
        this.addChild(this.timeCountLabel, 2);

        this.scoreLabel = cc.LabelTTF.create("Score: " + this.score, "myChinese", 30);
        this.scoreLabel.setAnchorPoint(0, 0);
        this.scoreLabel.setPosition(cc.p(1050, 680));
        this.scoreLabel.setTag(100);
        this.addChild(this.scoreLabel, 2);

        this.hpLabel = cc.LabelTTF.create("HP: " + this.hp, "myChinese", 30);
        this.hpLabel.setAnchorPoint(0, 0);
        this.hpLabel.setPosition(cc.p(650, 680));
        this.hpLabel.setTag(100);
        this.addChild(this.hpLabel, 2);

        this.schedule(this.addEnemy, 0.1);
        this.schedule(this.countDown, 1);
        this.schedule(this.updateGame);
        this.setTouchEnabled(true);

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

        return true;
    },

    onTouchesMoved: function (touches, event) {
    },

    onTouchesEnded: function (touches, event) {
        if ((!this.gameOver) && (!this.bossA)) {
            if (!this.boss) {
                if (this.onClickFlag) {
                    var touch = touches[0];
                    var location = touch.getLocation();
                    this.onClickFlag = false;
                }
            } else {
                if (this.bossHP != 0) {
                    this.removeChildByTag(111, true);
                    var enemy = cc.Sprite.create(enemyRightImg, cc.rect(831, 0, 193, 93));
                    enemy.setPosition(cc.p(this.blackHolePosition[7][0] + 200, this.blackHolePosition[7][1]));
                    enemy.setScale(1.5);
                    enemy.setTag(111);
                    enemy.setRotation(this.enemyRotate[7]);
                    //enemy.fire = 2;
                    this.addChild(enemy, 3);
                } else {
                    var fadeOut = cc.FadeOut.create(1);
                    (this.getChildByTag(111)).runAction(fadeOut);
                    this.scheduleOnce(function () {
                        this.removeChildByTag(111, true);
                        this.cleanup();
                        this.score += (this.hp / 10);
                        if (this.score < 10000) {
                            this.starLevel = 0;
                        } else if (this.score < 15000) {
                            this.starLevel = 1;
                        } else if (this.score < 20000) {
                            this.starLevel = 2;
                        } else {
                            this.starLevel = 3;
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
                    }, 1);
                    this.getChildByTag(112).cleanup();
                    //this.boss = false;
                    this.gameOver = true;
                }
            }
        }
               
    },

    returnMissionCallBack: function () {
        cc.Director.getInstance().pause();
        $("#Cocos2dGameContainer").css("display", "none");
        WinJS.Navigation.navigate("/pages/mission/mission.html");
    },

    onTouchesBegan: function (touches, event) {
        var touch = touches[0];
        var location = touch.getLocation();
        if ((!this.gameOver) && (!this.bossA)) {
            if (!this.boss) {
                for (var i = 0; i < this.hasEnemy.length; i++) {
                    if (this.hasEnemy[i] == true && this.getChildByTag(i).canDestory == true) {
                        if (cc.rectContainsPoint(this.getChildByTag(i).getBoundingBox(), location)) {
                            this.removeChildByTag(i, true);
                            var enemy;
                            if (this.enemyLeft[i]) {
                                enemy = cc.Sprite.create(enemyLeftImg, cc.rect(193, 0, 193, 93));
                            } else {
                                enemy = cc.Sprite.create(enemyRightImg, cc.rect(638, 0, 193, 93));
                            }
                            enemy.setPosition(cc.p(this.blackHolePosition[i][0], this.blackHolePosition[i][1]));
                            enemy.setScale(0.7);
                            enemy.setTag(i);
                            enemy.setRotation(this.enemyRotate[i]);
                            enemy.canDestory = false;
                            this.addChild(enemy, 3);
                            this.onClickFlag = true;
                            enemy.scheduleOnce(function () {
                                var FadeTo = cc.FadeTo.create(0.5, 0);
                                var enemyDisappear = cc.CallFunc.create(this.getParent().enemyDisappear, this, this.getTag());
                                this.runAction(cc.Sequence.create(FadeTo, enemyDisappear));
                            }, 0.001);
                            //某位置上有敌机了，同时该敌机目前可以被摧毁，但4秒之后就会逐渐变淡消失，变得不可摧毁
                            this.hasEnemy[i] = true;
                            this.score += 100;
                            this.scoreLabel.setString("Score: " + this.score);
                            this.gSharedEngine.playEffect(EFFECT_BUTTON_CHICK);
                        }
                    }
                }
            } else {
                if (cc.rectContainsPoint(this.getChildByTag(111).getBoundingBox(), location)) {
                    this.removeChildByTag(111, true);
                    var enemy = cc.Sprite.create(enemyRightImg, cc.rect(638, 0, 193, 93));
                    enemy.setPosition(cc.p(this.blackHolePosition[7][0] + 200, this.blackHolePosition[7][1]));
                    enemy.setScale(1.5);
                    enemy.setTag(111);
                    enemy.setRotation(this.enemyRotate[7]);
                    //enemy.fire = 2;
                    this.addChild(enemy, 3);
                    this.bossHP--;
                    this.score += 100 * this.bossScore;
                    this.scoreLabel.setString("Score: " + this.score);
                    this.gSharedEngine.playEffect(EFFECT_BUTTON_CHICK);
                }
            }
        }        
    },

    addEnemy: function () {
        if (!this.boss) {
            var nowEnemy = 0;
            for (var i = 0; i < this.hasEnemy.length; i++) {
                if (this.hasEnemy[i] == true) {
                    nowEnemy++;
                }
            }
            if (nowEnemy < this.enemyMax && Math.random() < (1 - nowEnemy / this.enemyMax)) {
                //随机出来一个位置，且该位置没有敌机
                var randomPosition = Math.round(Math.random() * (14 - 1));
                //为true代表了有敌机，继续随机没有敌机的位置
                while (this.hasEnemy[randomPosition] == true) {
                    randomPosition = Math.round(Math.random() * (14 - 1));
                }
                var enemy;
                if (this.enemyLeft[randomPosition]) {
                    enemy = cc.Sprite.create(enemyLeftImg, cc.rect(0, 0, 193, 93));
                } else {
                    enemy = cc.Sprite.create(enemyRightImg, cc.rect(831, 0, 193, 93));
                }
                enemy.setPosition(cc.p(this.blackHolePosition[randomPosition][0], this.blackHolePosition[randomPosition][1]));
                enemy.setScale(0.7);
                enemy.setTag(randomPosition);
                enemy.setRotation(this.enemyRotate[randomPosition]);
                enemy.canDestory = true;
                enemy.fire = 2;
                this.addChild(enemy, 3);
                enemy.scheduleOnce(function (randomPosition) {
                    this.canDestory = false;
                    var FadeTo = cc.FadeTo.create(0.5, 0);
                    var enemyDisappear = cc.CallFunc.create(this.getParent().enemyDisappear, this, this.getTag());
                    this.runAction(cc.Sequence.create(FadeTo, enemyDisappear));
                }, 4);
                enemy.schedule(function () {
                    var fire = cc.Sprite.create(this.getParent().fireImg[this.getParent().nowMission - 1], cc.rect(0, 0, this.getParent().fireImgSize[this.getParent().nowMission - 1][0], this.getParent().fireImgSize[this.getParent().nowMission - 1][1]));
                    fire.setPosition(cc.p(this.getParent().firePosition[this.getTag()][0], this.getParent().firePosition[this.getTag()][1]));
                    fire.setScale(0.5);
                    var flyTime = 0.2;
                    while (flyTime < 0.5) {
                        flyTime = Math.random();
                    }
                    var move = cc.MoveTo.create(flyTime, cc.p(625, 300));
                    var moveDone = cc.CallFunc.create(this.getParent().deleteFire, fire);
                    fire.runAction(cc.Sequence.create(move, moveDone));
                    this.getParent()._fire.push(fire);
                    this.getParent()._bong.push(false);
                    this.getParent().addChild(fire, 2);
                }, 1);
                //某位置上有敌机了，同时该敌机目前可以被摧毁，但4秒之后就会逐渐变淡消失，变得不可摧毁
                this.hasEnemy[randomPosition] = true;
            }
        }        
    },
    
    updateGame: function () {
        for (i in this._fire) {
            var fire = this._fire[i];
            var bong = this._bong[i];
            if (!bong && (Math.pow(Math.abs(fire.getPositionX() - 625), 2) + Math.pow(Math.abs(fire.getPositionY() - 300), 2) < Math.pow(105, 2))) {
                var effectSprite = cc.Sprite.createWithSpriteFrameName("pattern_destroy_00.png");
                var firePosition = fire.getPosition();
                effectSprite.setPosition(firePosition._x, firePosition._y);
                this.addChild(effectSprite, 30);
                var animation = cc.Animation.create(this.mDestroyFrames, 0.025);
                var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinish, this);
                effectSprite.runAction(cc.Sequence.create(cc.Animate.create(animation), actionMoveDone));
                this.gSharedEngine.playEffect(EFFECT_BUTTON_CHICK2);
                this.hp -= 100 * (0.2 * this.nowMission);
                this.hpLabel.setString("HP: " + this.hp);
                this._bong[i] = true;
            }

        }
    },

    deleteFire: function (sprite) {
        var index = this.getParent()._fire.indexOf(sprite);
        if (index > -1) {
            this.getParent()._fire.splice(index, 1);
            this.getParent()._bong.splice(index, 1);
        }
        this.getParent().removeChild(sprite, true);        
    },
    
    spriteMoveFinish: function (sprite) {
        this.removeChild(sprite, true);
    },

    //敌机消失的处理函数
    enemyDisappear: function (sprite, tag) {
        this.getParent().hasEnemy[tag] = false;
        this.getParent().removeChild(sprite, true);
    },

    countDown: function () {
        this.timeCount--;
        if(this.timeCount>=0){
            this.timeCountLabel.setString("Time: " + this.timeCount + "秒");
        }        
        if (this.timeCount == 55 || this.timeCount == 45 || this.timeCount == 30 || this.timeCount == 10) {
            this.enemyMax++;
        }
        if (this.timeCount <= 0) {
            //this.timeCount++;
            if (this.bossScore != 1) {
                this.bossScore--;
            }
        }
        if (this.timeCount == 0) {            
            this.boss = true;
            var allChildren = this.getChildren();
            for (var i = 0; i < allChildren.length; i++) {
                if (!(allChildren[i].getTag() == 100)) {
                    allChildren[i].cleanup();
                    var fadeOut = cc.FadeTo.create(0.5, 0);
                    var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinish, this);
                    allChildren[i].runAction(cc.Sequence.create(fadeOut,actionMoveDone));
                }
            }
            this.bossA = true;
            var blackHole = cc.Sprite.create(blackHoleImg, cc.rect(0, 0, 256, 256));
            blackHole.setPosition(cc.p(this.blackHolePosition[7][0]+200, this.blackHolePosition[7][1]));
            blackHole.setScale(0.5);
            blackHole.setOpacity(0);
            blackHole.setTag(112);
            var actionScale = cc.ScaleBy.create(1, 3);
            var actionFade = cc.FadeTo.create(1, 255);
            blackHole.runAction(cc.Spawn.create(actionScale, actionFade));
            this.addChild(blackHole, 2);
            this.scheduleOnce(function () {
                var enemy = cc.Sprite.create(enemyRightImg, cc.rect(831, 0, 193, 93));
                enemy.setPosition(cc.p(this.blackHolePosition[7][0] + 200, this.blackHolePosition[7][1]));
                enemy.setScale(0.5);
                enemy.setOpacity(0);
                var actionScale = cc.ScaleBy.create(0.5, 3);
                var actionFade = cc.FadeTo.create(0.5, 255);
                enemy.runAction(cc.Spawn.create(actionScale, actionFade));
                enemy.setTag(111);
                enemy.setRotation(this.enemyRotate[7]);
                enemy.scheduleOnce(function () {
                    this.getParent().bossA = false;
                }, 0.5);
                //enemy.fire = 2;
                this.addChild(enemy, 3);
                this.getChildByTag(112).schedule(function () {
                    var fire = cc.Sprite.create(this.getParent().fireImg[this.getParent().nowMission - 1], cc.rect(0, 0, this.getParent().fireImgSize[this.getParent().nowMission - 1][0], this.getParent().fireImgSize[this.getParent().nowMission - 1][1]));
                    fire.setPosition(cc.p(this.getParent().blackHolePosition[7][0] + 100, this.getParent().blackHolePosition[7][1]));
                    fire.setScale(0.5);
                    var move = cc.MoveTo.create(0.3, cc.p(625, 300));
                    var moveDone = cc.CallFunc.create(this.getParent().deleteFire, fire);
                    fire.runAction(cc.Sequence.create(move, moveDone));
                    this.getParent()._fire.push(fire);
                    this.getParent()._bong.push(false);
                    this.getParent().addChild(fire, 2);
                }, 0.4, 100, 0.5);
            }, 1);            
        }
    }
});
