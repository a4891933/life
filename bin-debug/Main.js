var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        var _this = this;
        var manage = pg.Loading.Manage;
        manage.setConfig(pg.Res.getVirtualUrl(Main.resPath), pg.Res.getVirtualUrl(Main.thmPath), pg.Res.getVirtualUrl(Main.resRoot));
        manage.loading("preload", function () {
            _this.createGameScene();
        }, null, this);
    };
    Main.prototype.createGameScene = function () {
        // pg.StageManager.popDisplayObjectContainer(new nuan.MainView());
        setTimeout(function () {
            pg.StageManager.popDisplayObjectContainer(new CollectionEventExample());
        }, 300);
    };
    return Main;
}(egret.DisplayObjectContainer));
Main.resPath = "resource/default.res.json";
Main.resRoot = "resource/";
Main.thmPath = "resource/default.thm.json";
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map