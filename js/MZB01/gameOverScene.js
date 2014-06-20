var MZB01GameOverLayer = cc.LayerColor.extend({
    init: function () {
        this._super();

        var winSize = cc.Director.getInstance().getWinSize();
        var origin = cc.Director.getInstance().getVisibleOrigin();

        this.bg = cc.Sprite.create(MZB01BG, cc.rect(0, 0, 1366, 768));
        this.bg.setPosition(cc.p(origin.x + winSize._width / 2, origin.y + this.bg.getContentSize().height / 2));
        this.addChild(this.bg, 1);

        var _label = cc.LabelTTF.create("GameOver", "Thonburi", 40);
        // 设置位置
        _label.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        this.addChild(_label,2);
        return true;
    }
})