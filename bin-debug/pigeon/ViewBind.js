var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var pigeon;
(function (pigeon) {
    var BindBase = (function () {
        function BindBase() {
        }
        return BindBase;
    }());
    __reflect(BindBase.prototype, "BindBase");
    var ViewBind = (function () {
        function ViewBind() {
            //初始化监听列表
            this.eventList = [];
            //初始化计时器
            this.timer = pigeon.SingleTimerCore.create(100, this.loop, this);
        }
        ViewBind.prototype.loop = function () {
            //每次循环检测监听列表内容，对比差异 执行监听事件
            this.eventList.forEach(function (event) {
            });
        };
        ViewBind.prototype.addEvent = function () {
            //添加监听列表内容
            //进行第一遍的数据拷贝
        };
        ViewBind.prototype.removeEvent = function () {
            //移除数据监听内容
            //移除数据的拷贝释放内存
        };
        return ViewBind;
    }());
    pigeon.ViewBind = ViewBind;
    __reflect(ViewBind.prototype, "pigeon.ViewBind");
})(pigeon || (pigeon = {}));
//# sourceMappingURL=ViewBind.js.map