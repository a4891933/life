var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pigeon;
(function (pigeon) {
    var BaseComponent = (function (_super) {
        __extends(BaseComponent, _super);
        function BaseComponent(skinName) {
            var _this = _super.call(this) || this;
            _this.pre = "";
            if (skinName) {
                _this.skinName = _this.pre + skinName;
            }
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onEnter, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onExit, _this);
            return _this;
        }
        return BaseComponent;
    }(eui.Component));
    pigeon.BaseComponent = BaseComponent;
    __reflect(BaseComponent.prototype, "pigeon.BaseComponent");
})(pigeon || (pigeon = {}));
//# sourceMappingURL=BaseComponent.js.map