var MyFirstApp = cc.Layer.extend({
    _jetSprite:null,
    init: function () {
        this._super();
        this.initWithColor(new cc.Color4B(0, 0, 0, 255));
        var size = cc.Director.getInstance.getWinSize();

        this._jetSprite = new jetSprite();
        this.setTouchEnabled(true);

        this.setPosition(new cc.Point(0, 0));

        this.addChild(this._jetSprite);
        this._jetSprite.setPosition(new cc.Point(size.width / 2, size.height / 2));
        this._jetSprite.scheduleUpdate();
        this.schedule(this.update);

        return true;
    },
    onEnter: function () {
        this._super();
    },
    update: function (dt) {

    },
    onTouchesEnded: function (pTouch, pEvent) {
        this._jetSprite.handleTouch(pTouch[0].getLocation());
    },
    onTouchesMoved: function (pTouch, pEvent) {
        this._jetSprite.handleTouchMove(pTouch[0].getLocation());
    }
});

var MyFirstAppScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MyFirstApp();
        layer.init();
        this.addChild(layer);
    }
})