var JetSprite = cc.Sprite.extend({
    _currentRotation: 0,
    ctor: function () {
        this.initWithFile("../images/logo.png");
    },
    update: function () {
        this.setRotation(this._currentRotation);
    },
    handleTouch: function (touchLocation) {
        if (touchLocation.x < 300)
            this._currentRotation = 0;
        else
            this._currentRotation = 180;
    },
    handleTouchMove: function (touchLocation) {
        var angle = Math.atan2(touchLocation.x - 300, touchLocation.y - 300);
        angle = angle * (180 / Math.PI);
        this._currentRotation = angle;
    }
});