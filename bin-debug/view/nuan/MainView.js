var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var nuan;
(function (nuan) {
    var MainView = (function (_super) {
        __extends(MainView, _super);
        function MainView() {
            return _super.call(this, "resource/skins/main_skin.exml") || this;
        }
        MainView.prototype.onEnter = function () {
        };
        MainView.prototype.onExit = function () {
        };
        return MainView;
    }(pg.BaseComponent));
    nuan.MainView = MainView;
    __reflect(MainView.prototype, "nuan.MainView");
})(nuan || (nuan = {}));
//# sourceMappingURL=MainView.js.map