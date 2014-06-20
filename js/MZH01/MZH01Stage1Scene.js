/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


var MyLayer = cc.LayerColor.extend({

    answer: 1,
    temp: null,
    rightLabel: null,
    wrongLabel: null,
    rightNumber: 0,
    wrongNumber: 0,
    time: 60,
    gSharedEngine:null,


    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();
        this.setTag(111);
        this._bullets = [];
        this._targets = [];

        

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
        this.setColor(cc.c4(126, 126, 126, 126));
        var winSize = cc.Director.getInstance().getWinSize();
        var origin = cc.Director.getInstance().getVisibleOrigin();


        this.girl = cc.Sprite.create(test2, cc.rect(0, 0, 96, 121));
        this.girl.setPosition(cc.p(origin.x + winSize._width / 2, origin.y + this.girl.getContentSize().height / 2));

        this.addChild(this.girl, 1);

        this.temp = cc.Sprite.create(test1, cc.rect(0, 0, 50, 50));
        this.temp.setPosition(cc.p(origin.x + 100, origin.y + this.girl.getContentSize().height / 2 + 100));

        this.addChild(this.temp, 1);

        this.rightLabel = cc.LabelTTF.create("right: 0", "Courier", 20);
        this.rightLabel.setPosition(cc.p(origin.x + 100, origin.y + this.girl.getContentSize().height / 2 + 300));

        this.addChild(this.rightLabel, 1);

        this.wrongLabel = cc.LabelTTF.create("wrong: 0", "Courier", 20);
        this.wrongLabel.setPosition(cc.p(origin.x + 100, origin.y + this.girl.getContentSize().height / 2 + 200));

        this.addChild(this.wrongLabel, 1);

        this.mProgressBgSpr = cc.Sprite.create(test3);
        this.mProgressBgSpr.setAnchorPoint(0.0, 0.5);
        this.mProgressBgSpr.setPosition(cc.p(origin.x + 100, origin.y + this.girl.getContentSize().height / 2 + 400));
        this.addChild(this.mProgressBgSpr);

        this.mProgressSpr = cc.Sprite.create(test4);
        this.mProgressSpr.setAnchorPoint(0.0, 0.5);
        this.mProgressSpr.setPosition(cc.p(origin.x + 100, origin.y + this.girl.getContentSize().height / 2 + 400));
        this.addChild(this.mProgressSpr);
        //this.schedule(this.addBullet, 0.2);
        this.schedule(this.addTarget, 0.4);
        this.schedule(this.changeAnswer, 5.0);
        this.schedule(this.updateGame);
        this.schedule(this.progress);
        //this.setTouchEnabled(true);
        this.setTouchEnabled(true);

        var itemStartGame = cc.MenuItemImage.create(
                "/images/frame/return.png",
                "/images/frame/returnPress.png",
                this.menuCallBack,
                this
            );
        itemStartGame.setPosition(160, 160);
        var menu = cc.Menu.create(itemStartGame);
        menu.setPosition(0, 0);
        this.addChild(menu);


        return true;
    },

    menuCallBack: function () {
        cc.Director.getInstance().pause();
        $("#Cocos2dGameContainer").css("display", "none");
        WinJS.Navigation.navigate("/pages/mission/mission.html");
    },

    progress:function(){
        this.time = this.time - 1;
        if (this.time == -1) {
            this.time = 60;
        }
        var widthTemp = 257 * (this.time / 60);
        this.mVisibleRect = cc.rect(0, 0, widthTemp, 18);
        this.mProgressSpr.setTextureRect(this.mVisibleRect);
    },

    changeAnswer: function () {
        var origin = cc.Director.getInstance().getVisibleOrigin();
        var changeAnswer=this.answer;
        while (changeAnswer == this.answer) {
            changeAnswer = Math.round(Math.random() * (4 - 1)) + 1;
        }
        this.answer = changeAnswer;

        this.removeChild(this.temp, true);

        switch (this.answer) {
            case 1:
                this.temp = cc.Sprite.create(test1, cc.rect(0, 0, 50, 50));
                break;
            case 2:
                this.temp = cc.Sprite.create(test1, cc.rect(70, 0, 50, 50));
                break;
            case 3:
                this.temp = cc.Sprite.create(test1, cc.rect(140, 0, 50, 50));
                break;
            case 4:
                this.temp = cc.Sprite.create(test1, cc.rect(207, 0, 50, 50));
                break;
            default:
                this.temp = cc.Sprite.create(test1, cc.rect(207, 0, 50, 50));
                break;
        }
        this.temp.setPosition(cc.p(origin.x + 100, origin.y + this.girl.getContentSize().height / 2 + 100));

        this.addChild(this.temp, 1);
    },

    onTouchesMoved: function (touches, event) {
        var origin = cc.Director.getInstance().getVisibleOrigin();
        var touch = touches[0];
        var location = touch.getLocation();
        if (this.onClickFlag) {
            this.girl.setPosition(cc.p(location.x, origin.y + this.girl.getContentSize().height / 2));
        }
    },

    onTouchesEnded: function (touches, event) {
        this.onClickFlag = false;
    },

    onTouchesBegan: function (touches, event) {
        var touch = touches[0];
        var location = touch.getLocation();
        if (cc.rectContainsPoint(this.girl.getBoundingBox(), location)) {
            this.onClickFlag = true;
        }
    },

    addBullet: function () {
        var winSize = cc.Director.getInstance().getWinSize();
        var origin = cc.Director.getInstance().getVisibleOrigin();

        var planePosition = this.plane.getPosition();

        var bulletDuration = 1;

        var bullet = cc.Sprite.create(test2, cc.rect(66, 237, 7, 20));

        bullet.setPosition(cc.p(planePosition._x, planePosition._y + bullet.getContentSize().height));

        var actionMove = cc.MoveTo.create(bulletDuration * ((winSize._height - planePosition._y - bullet.getContentSize().height / 2) / winSize._height), cc.p(planePosition._x, origin.y + winSize._height + bullet.getContentSize().height / 2));

        var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinish, this);

        bullet.runAction(cc.Sequence.create(actionMove, actionMoveDone));

        bullet.setTag(6);
        this._bullets.push(bullet);
        this.addChild(bullet, 0);
    },

    addTarget: function () {
        var target;
        switch (Math.round(Math.random() * (4 - 1)) + 1) {
            case 1:
                target = cc.Sprite.create(test1, cc.rect(0, 0, 50, 50));
                target.setTag(1);
                break;
            case 2:
                target = cc.Sprite.create(test1, cc.rect(70, 0, 50, 50));
                target.setTag(2);
                break;
            case 3:
                target = cc.Sprite.create(test1, cc.rect(140, 0, 50, 50));
                target.setTag(3);
                break;
            case 4:
                target = cc.Sprite.create(test1, cc.rect(207, 0, 50, 50));
                target.setTag(4);
                break;
            default:
                target = cc.Sprite.create(test1, cc.rect(207, 0, 50, 50));
                target.setTag(4);
                break;
        }        

        var winSize = cc.Director.getInstance().getWinSize();
        var minX = target.getContentSize().width / 2;
        var maxX = winSize.width - target.getContentSize().width / 2;
        var rangeX = maxX - minX;
        var actualX = Math.random() * rangeX + minX;
        var minDuration = 2.5;
        var maxDuration = 4;
        var rangeDuration = maxDuration - minDuration;
        var actualDuration = Math.random() * rangeDuration + minDuration;

        target.setPosition(cc.p(actualX, winSize.height + target.getContentSize().height / 2));

        var actionMove = cc.MoveTo.create(actualDuration, cc.p(actualX, 0 - target.getContentSize().height));
        var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinish, this);

        target.runAction(cc.Sequence.create(actionMove, actionMoveDone));
        this.addChild(target, 1);
        this._targets.push(target);
    },
    updateGame: function () {
        /*
        var targets2Delete = [];

        var i;
        for (i in this._targets) {
            //console.log("targetIterator");
            var target = this._targets[i];
            var targetRect = target.getBoundingBox();

            var bullets2Delete = [];
            for (i in this._bullets) {
                var bullet = this._bullets[i];
                var bulletRect = bullet.getBoundingBox();
                if (cc.rectIntersectsRect(bulletRect, targetRect)) {
                    bullets2Delete.push(bullet);
                }
            }
            if (bullets2Delete.length > 0) {
                targets2Delete.push(target);
            }

            for (i in bullets2Delete) {
                var bullet = bullets2Delete[i];
                var index = this._bullets.indexOf(bullet);
                if (index > -1) {
                    this._bullets.splice(index, 1);
                }
                this.removeChild(bullet);
            }

            bullets2Delete = null;
        }
        for (i in targets2Delete) {
            var target = targets2Delete[i];

            var index = this._targets.indexOf(target);
            if (index > -1) {
                this._targets.splice(index, 1);
            }

            this.removeChild(target);
        }
        
        */
        var planeRect = this.girl.getBoundingBox();

        for (i in this._targets) {
            var target = this._targets[i];
            var targetRect = target.getBoundingBox();
            if (cc.rectIntersectsRect(targetRect, planeRect)) {
                if (target.getTag() == this.answer) {
                    var effectSprite = cc.Sprite.createWithSpriteFrameName("pattern_destroy_00.png");
                    var planePosition = this.girl.getPosition();
                    effectSprite.setPosition(planePosition._x, planePosition._y);
                    this.addChild(effectSprite,30);
                    var animation = cc.Animation.create(this.mDestroyFrames, 0.025);
                    var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinish, this);
                    effectSprite.runAction(cc.Sequence.create(cc.Animate.create(animation), actionMoveDone));
                    this.rightNumber = this.rightNumber + 1;
                    this.rightLabel.setString("Right: " + this.rightNumber);
                    this.gSharedEngine.playEffect(EFFECT_BUTTON_CHICK);
                } else {
                    var effectSprite = cc.Sprite.createWithSpriteFrameName("pattern_explode_00.png");
                    var planePosition = this.girl.getPosition();
                    effectSprite.setPosition(planePosition._x, planePosition._y);
                    this.addChild(effectSprite, 30);
                    var animation = cc.Animation.create(this.mExplodeFrames, 0.025);
                    var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinish, this);
                    effectSprite.runAction(cc.Sequence.create(cc.Animate.create(animation), actionMoveDone));
                    this.wrongNumber = this.wrongNumber + 1;
                    this.wrongLabel.setString("Wrong: " + this.wrongNumber);
                    this.gSharedEngine.playEffect(EFFECT_BUTTON_CHICK2);
                }
                this._targets.splice(i, 1);
                this.removeChild(target);
                //this.removeChild(this.plane);
                /*
                var gameOverScene = GameOverScene.create();
                var tranScene = cc.TransitionMoveInL.create(0.5, gameOverScene);
                cc.Director.getInstance().replaceScene(tranScene);

                this._isPlaying = false;
                */

            }
        }
        targets2Delete = null;

    },

    spriteMoveFinish: function (sprite) {
        this.removeChild(sprite, true);
        if (sprite.getTag() == 1 || sprite.getTag() == 2 || sprite.getTag() == 3 || sprite.getTag() == 4) {
            var index = this._targets.indexOf(sprite);
            if (index > -1) {
                this._targets.splice(index, 1);
            }
        } else if (sprite.getTag() == 6) {
            var index = this._bullets.indexOf(sprite);
            if (index > -1) {
                this._bullets.splice(index, 1);
            }
        }
    }
    
});
var MZH01Stage1Scene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        spriteFrameCache.addSpriteFrames("/images/baseResource.plist", "/images/baseResource.png");
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
