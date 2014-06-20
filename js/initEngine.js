var initLayer = cc.LayerColor.extend({
    init: function () {
        this._super();
        this.setColor(cc.c4(126, 126, 126, 126));
        return true;
    }
});
var initEngine = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new initLayer();
        this.addChild(layer);
        layer.init();
    }
});
