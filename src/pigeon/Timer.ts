module pigeon {
    /**
     * author Tt.
     * 使用说明
     * 与egretTimer不同，创建的同时直接开始运行
     * 单机游戏常用的timer功能，全局的暂停效果
     */
    enum TIMERSTATE {
        run = 1,        //运行中状态      执行回调
        pause = 2,      //暂停中的状态   
        stop = 3        //停止的循环
    }
    export class SingleTimer {
        //开始/恢复运行
        public start() {
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
        }
        //停止运行
        public stop() {
            this.state = TIMERSTATE.stop;
        }
        //暂停运行
        public pause() {
            var nowTime = new Date().getTime();
            this._pause(nowTime);
        }
        //恢复运行
        public resume() {
            if (this.state == TIMERSTATE.stop) {
                console.error("SingleTimer已清理,无法再次运行");
                return;
            }
            var nowTime = new Date().getTime();
            this._resume(nowTime);
        }

        public id: number;//唯一标识
        private delay: number;//每次循环的延迟
        private callback: Function;//回调
        private target: any;//回调对象
        public state: TIMERSTATE;//当前标记状态
        private lTime: number;//上一次运行的时间
        private pTime: number;//暂停时的时间---通过此时间来对lTime进行刷新
        // private maxCount: number;//最大次数--拓展用
        constructor(id, delay, callback, target) {
            this.id = id;
            this.delay = delay;
            this.callback = callback;
            this.target = target;
            //默认自动运行---移除之后不默认
            this.lTime = new Date().getTime();
            this.pTime = 0;
            this.state = TIMERSTATE.run;
        }
        public __run(nowTime: number) {
            this._run(nowTime);
        }
        private _run(nowTime: number) {
            //当时间不足间隔时间不进行操作
            if (nowTime - this.lTime < this.delay) return;
            this.lTime = nowTime;
            if (this.callback) {
                this.callback.call(this.target);
            } else {
                console.error("SingleTimer异常,无有效的callback");
            }
        }
        private _pause(nowTime: number) {
            this.pTime = nowTime;
            this.state = TIMERSTATE.pause;
        }
        private _resume(nowTime: number) {
            var subTime = nowTime - this.pTime;
            this.lTime += subTime;//将循环的上次执行时间增加上暂停的时间
            this.state = TIMERSTATE.run;
        }
    }
    export class SingleTimerCore {
        public static create(delay, callback, target):SingleTimer {
            var self = SingleTimerCore.getIns();
            var id = self._randId();
            var timer = new SingleTimer(id, delay, callback, target);
            self._add(timer);
            return timer;
        }
        public static remove(timer: SingleTimer) {
            SingleTimerCore.getIns()._remove(timer);
        }
        public static pause() {
            SingleTimerCore.getIns()._pause();
        }
        public static resume() {
            SingleTimerCore.getIns()._resume();
        }

        private _coreTimer: egret.Timer;
        private _eventArray: Array<SingleTimer>;
        constructor() {
            //可以考虑每帧执行
            this._coreTimer = new egret.Timer(30);
            this._coreTimer.addEventListener(egret.TimerEvent.TIMER, this._mainLoop, this);
            this._coreTimer.start();
        }
        private _mainLoop() {
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
        }
        //
        private _add(event: SingleTimer) {
            //注意id是否重复---一般不可能
            this._eventArray.push(event);
        }
        private _pause() {
            this._eventArray.forEach(timer => {
                timer.pause();
            })
        }
        private _resume() {
            this._eventArray.forEach(timer => {
                timer.resume();
            })
        }
        private _remove(event: SingleTimer) {
            for (var i = 0; i < this._eventArray.length; i++) {
                if (this._eventArray[i].id == event.id) {
                    this._eventArray.splice(i, 1);
                    i--;
                }
            }
        }
        //随机id
        private _randId(): number {
            var nowTime = new Date().getTime();
            var randNumber = Math.floor(Math.random() * 100000) / 100000;
            return nowTime + randNumber;
        }
        //单例
        private static instance: SingleTimerCore;
        private static getIns(): SingleTimerCore {
            if (!SingleTimerCore.instance) {
                SingleTimerCore.instance = new SingleTimerCore();
            }
            return SingleTimerCore.instance;
        }
    }
}