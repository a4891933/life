var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var pigeon;
(function (pigeon) {
    /**
     * author Tt.
     * 使用说明
     * 与egretTimer不同，创建的同时直接开始运行
     * 单机游戏常用的timer功能，全局的暂停效果
     */
    var TIMERSTATE;
    (function (TIMERSTATE) {
        TIMERSTATE[TIMERSTATE["run"] = 1] = "run";
        TIMERSTATE[TIMERSTATE["pause"] = 2] = "pause";
        TIMERSTATE[TIMERSTATE["stop"] = 3] = "stop"; //停止的循环
    })(TIMERSTATE || (TIMERSTATE = {}));
    var SingleTimer = (function () {
        // private maxCount: number;//最大次数--拓展用
        function SingleTimer(id, delay, callback, target) {
            this.id = id;
            this.delay = delay;
            this.callback = callback;
            this.target = target;
            //默认自动运行---移除之后不默认
            this.lTime = new Date().getTime();
            this.pTime = 0;
            this.state = TIMERSTATE.run;
        }
        //开始/恢复运行
        SingleTimer.prototype.start = function () {
            if (this.state == TIMERSTATE.stop) {
                console.error("SingleTimer已清理,无法再次运行");
                return;
            }
            if (this.state == TIMERSTATE.pause) {
                this.resume();
                return;
            }
            var nowTime = new Date().getTime();
            this.lTime = nowTime;
            this.pTime = 0;
            this.state = TIMERSTATE.run;
        };
        //停止运行
        SingleTimer.prototype.stop = function () {
            this.state = TIMERSTATE.stop;
        };
        //暂停运行
        SingleTimer.prototype.pause = function () {
            var nowTime = new Date().getTime();
            this._pause(nowTime);
        };
        //恢复运行
        SingleTimer.prototype.resume = function () {
            if (this.state == TIMERSTATE.stop) {
                console.error("SingleTimer已清理,无法再次运行");
                return;
            }
            var nowTime = new Date().getTime();
            this._resume(nowTime);
        };
        SingleTimer.prototype.__run = function (nowTime) {
            this._run(nowTime);
        };
        SingleTimer.prototype._run = function (nowTime) {
            //当时间不足间隔时间不进行操作
            if (nowTime - this.lTime < this.delay)
                return;
            this.lTime = nowTime;
            if (this.callback) {
                this.callback.call(this.target);
            }
            else {
                console.error("SingleTimer异常,无有效的callback");
            }
        };
        SingleTimer.prototype._pause = function (nowTime) {
            this.pTime = nowTime;
            this.state = TIMERSTATE.pause;
        };
        SingleTimer.prototype._resume = function (nowTime) {
            var subTime = nowTime - this.pTime;
            this.lTime += subTime; //将循环的上次执行时间增加上暂停的时间
            this.state = TIMERSTATE.run;
        };
        return SingleTimer;
    }());
    pigeon.SingleTimer = SingleTimer;
    __reflect(SingleTimer.prototype, "pigeon.SingleTimer");
    var SingleTimerCore = (function () {
        function SingleTimerCore() {
            //可以考虑每帧执行
            this._coreTimer = new egret.Timer(30);
            this._coreTimer.addEventListener(egret.TimerEvent.TIMER, this._mainLoop, this);
            this._coreTimer.start();
        }
        SingleTimerCore.create = function (delay, callback, target) {
            var self = SingleTimerCore.getIns();
            var id = self._randId();
            var timer = new SingleTimer(id, delay, callback, target);
            self._add(timer);
        };
        SingleTimerCore.remove = function (timer) {
            SingleTimerCore.getIns()._remove(timer);
        };
        SingleTimerCore.pause = function () {
            SingleTimerCore.getIns()._pause();
        };
        SingleTimerCore.resume = function () {
            SingleTimerCore.getIns()._resume();
        };
        SingleTimerCore.prototype._mainLoop = function () {
            var nowTime = new Date().getTime();
            var eventArr = this._eventArray;
            var eventArrLength = eventArr.length;
            for (var i = 0; i < eventArrLength; i++) {
                var timer = eventArr[i];
                if (timer.state == TIMERSTATE.stop) {
                    eventArr.splice(i, 1);
                    timer = null;
                    i--;
                    continue;
                }
                timer.__run(nowTime);
            }
        };
        //
        SingleTimerCore.prototype._add = function (event) {
            //注意id是否重复---一般不可能
            this._eventArray.push(event);
        };
        SingleTimerCore.prototype._pause = function () {
            this._eventArray.forEach(function (timer) {
                timer.pause();
            });
        };
        SingleTimerCore.prototype._resume = function () {
            this._eventArray.forEach(function (timer) {
                timer.resume();
            });
        };
        SingleTimerCore.prototype._remove = function (event) {
            for (var i = 0; i < this._eventArray.length; i++) {
                if (this._eventArray[i].id == event.id) {
                    this._eventArray.splice(i, 1);
                    i--;
                }
            }
        };
        //随机id
        SingleTimerCore.prototype._randId = function () {
            var nowTime = new Date().getTime();
            var randNumber = Math.floor(Math.random() * 100000) / 100000;
            return nowTime + randNumber;
        };
        SingleTimerCore.getIns = function () {
            if (!SingleTimerCore.instance) {
                SingleTimerCore.instance = new SingleTimerCore();
            }
            return SingleTimerCore.instance;
        };
        return SingleTimerCore;
    }());
    pigeon.SingleTimerCore = SingleTimerCore;
    __reflect(SingleTimerCore.prototype, "pigeon.SingleTimerCore");
})(pigeon || (pigeon = {}));
