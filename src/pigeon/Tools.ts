module pigeon {
    /**
     * Create By Tt. 2016/7/22
     * */
    /**
     * 消息打印
     * @platform Web,Native
     */
    export class Log {
        public static isDebug = true;
        //信息
        public static info(msg) {
            console.info(msg);
        }
        //警告
        public static warn(msg) {
            console.warn("%c" + msg, "color: purple;");
        }
        //错误
        public static error(msg) {
            console.error(msg);
        }
        //debug专用
        public static debug(msg) {
            if (!Log.isDebug) return;
            console.log("%c  " + msg, "color: green;");
        }
        public static print(msg) {
            var print = function (msg?: any, msg2?: any) {
                if (msg instanceof Array) {
                    msg.forEach(print);
                } else if (msg instanceof Object) {
                    for (var idx in msg) {
                        print(idx, msg[idx]);
                    }
                } else if (msg2 || msg2 == 0) {
                    console.log(msg + "  " + msg2);
                } else {
                    console.log(msg);
                }
            }
            print(msg);
        }
    }

    /**
     * 简化TOUCH_TAP的书写长度问题
     * @platform Web,Native
     */
    export module TouchTap {
        // export function add(item:eui.Image,callback:Function, target:any);
        export function add(item: any, callback: Function, target: any) {
            if (!item) {
                Log.error("添加按钮响应失败,传入了错误的item");
                return false;
            }
            if (!callback || !target) {
                Log.error("添加按钮响应失败,传入了空回调");
                return false;
            }
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, callback, target);
            return true;
        }
        export function remove(item, callback, target) {
            if (!item) {
                return false;
            }
            item.removeEventListener(egret.TouchEvent.TOUCH_TAP, callback, target);
            return true;
        }
    }

    /**
     * 使用pigeon.Timer 代替 egret.Timer 在游戏中更方便的进行 timer的注册和移除 （主要是移除方便）
     * @platform Web,Native
     */
    export module Timer {
        export class TimerStruct {
            public timer: egret.Timer;
            public callback: Function;
            public target: any;
        }

        /**
         * 使用创建一个pigeon.Timer
         * @param delay 计时器事件间的延迟（以毫秒为单位）。建议 delay 不要低于 20 毫秒。计时器频率不得超过 60 帧/秒，这意味着低于 16.6 毫秒的延迟可导致出现运行时问题。
         * @param callback 调用的函数
         * @returns 返回一个pigeonTimer
         */
        export function create(delay: number, callback: Function, target: any) {
            var timer = new egret.Timer(delay);
            timer.addEventListener(egret.TimerEvent.TIMER, callback, target);
            timer.start();
            var timerStruct = new TimerStruct();
            timerStruct.timer = timer;
            timerStruct.callback = callback;
            timerStruct.target = target;
            return timerStruct;
        }
        export function remove(timerStruct: TimerStruct) {
            if (!timerStruct) return;
            if (timerStruct.timer) {
                timerStruct.timer.stop();
                timerStruct.timer.removeEventListener(egret.TimerEvent.TIMER, timerStruct.callback, timerStruct.target);
                timerStruct.timer = null;
            }
            timerStruct = null;
            return null;
        }
    }


    /**
     * 使用异步加载替代同步加载，在H5版本中，可以不进行Group的加载。
     * @platform Web,Native
     */
    export module Res {
        export function getRes(item, url) {
            if (!item) {
                Log.error("加载图片失败,传入了错误的item")
                return;
            }
            RES.getResAsync(url, function () {
                item.source = RES.getRes(url);
            }, this);
        }
        //加载玩家头像
        export function loadIcon(item: eui.Image, picUrl: string) {
            if (!item) {
                Log.error("加载玩家头像失败,传入了错误的item")
                return;
            }
            RES.getResByUrl(picUrl, function (data, url) {
                if (!data) return;
                item.visible = false;
                item.texture = <egret.Texture>data;
            }, this, RES.ResourceItem.TYPE_IMAGE);
        }
    }

    /**
     * 平台检测工具
     * @platform Web,Native
     */
    export class PlatUntils {
        //判断是否是原生
        public static get isNative(): boolean {
            return egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
        }
        //判断是否是手机
        public static get isMobile(): boolean {
            return egret.Capabilities.isMobile;
        }
        //判断是否是Android
        public static isAndroid() {
            return PlatUntils.Platform == PlatUntils.PF_ANDROID;
        }
        //判断是否是IOS
        public static isIos() {
            return PlatUntils.Platform == PlatUntils.PF_IOS;
        }
        /**平台*/
        public static PF_PC = 1;//1-PC
        public static PF_ANDROID = 2;//2-安卓
        public static PF_IOS = 3;//3-苹果
        public static PF_ANDROID_H5 = 4;//4-安卓H5
        public static PF_IOS_H5 = 5;//5-苹果H5
        /**浏览器判断*/
        private static browser = {
            versions: function () {
                if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) return null;
                var u = navigator.userAgent, app = navigator.appVersion;
                return {
                    //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            } ()
        }
        /**平台判断*/
        public static get Platform(): number {
            if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
                if (egret.Capabilities.os == "IOS") {
                    return PlatUntils.PF_IOS;
                }
                if (egret.Capabilities.os == "iOS") {
                    return PlatUntils.PF_IOS;
                }
                if (egret.Capabilities.os == "Android") {
                    return PlatUntils.PF_ANDROID;
                }
                if (egret.Capabilities.os == "Mac OS") {
                    return PlatUntils.PF_IOS;
                }
                return PlatUntils.PF_PC;
            } else {
                if (PlatUntils.browser.versions.android) return PlatUntils.PF_ANDROID_H5;
                if (PlatUntils.browser.versions.iPhone || PlatUntils.browser.versions.iPad) return PlatUntils.PF_IOS_H5;
                return PlatUntils.PF_PC;
            }
        }
    }

    /**
     * 游戏效率检测工具
     * @platform Web,Native
     */
    export module Efficiency {
        export class TimeRecordStruct {
            public key: string;//标识用Key
            public count: number;//触发的次数
            public startTime: number;//开始时间
            public endTime: number;//结束时间
            public costTime: number;//花费的时间
            public averageTime: number;//平均时间
            constructor(key) {
                this.key = key;
                this.count = 0;
                this.startTime = 0;
                this.endTime = 0;
                this.costTime = 0;
                this.averageTime = 0;
            }
            //开始记录
            public start() {
                this.count++;
                this.startTime = new Date().getTime();
            }
            //结束记录
            public stop(desc: string) {
                if (!desc) desc = "";
                this.endTime = new Date().getTime();
                this.costTime = this.endTime - this.startTime;
                this.averageTime = Math.round((this.averageTime * (this.count - 1) + this.costTime) / this.count);
                Log.debug(desc + "   key->" + this.key + "   此次花费时间->" + this.costTime + "ms    检测次数->"
                    + this.count + "    平均花费时间->" + this.averageTime + "ms");
            }
        }
        export class TimeRecord {
            //所有执行中的数据数组
            private recordingArray: Array<TimeRecordStruct>;
            //所有执行过的数据数组
            private bufferArray: Array<TimeRecordStruct>;
            constructor() {
                this.recordingArray = [];
                this.bufferArray = [];
            }
            private addToBufferArray(record: TimeRecordStruct) {
                this.bufferArray.push(record);
            }
            private removeFromBufferArray(record: TimeRecordStruct) {
                for (var i = 0; i < this.bufferArray.length; i++) {
                    var rd = this.bufferArray[i];
                    if (rd.key == record.key) {
                        this.bufferArray.splice(i, 1);
                        break;
                    }
                }
            }
            private getSameFromBufferArray(key) {
                var timeRecord: TimeRecordStruct;
                this.bufferArray.forEach((timerecord) => {
                    if (timerecord.key == key) {
                        timeRecord = timerecord;
                    }
                });
                return timeRecord;
            }
            private addToRecordingArray(record: TimeRecordStruct) {
                this.recordingArray.push(record);
            }
            private removeFromRecordingArray(record: TimeRecordStruct) {
                for (var i = 0; i < this.recordingArray.length; i++) {
                    var rd = this.recordingArray[i];
                    if (rd.key == record.key) {
                        this.recordingArray.splice(i, 1);
                        break;
                    }
                }
            }
            private getSameFromRecordingArray(key) {
                var timeRecord: TimeRecordStruct;
                this.recordingArray.forEach((timerecord) => {
                    if (timerecord.key == key) {
                        timeRecord = timerecord;
                    }
                });
                return timeRecord;
            }
            public startRecord(key) {
                var isSameRecording = this.getSameFromRecordingArray(key);
                if (isSameRecording) {
                    Log.warn("查询到重复的record，key->" + key);
                    Log.warn("请先停止上一个相同key的record");
                    return;
                }
                var record = this.getSameFromBufferArray(key);
                if (!record) {
                    record = new TimeRecordStruct(key);
                } else {
                    this.removeFromBufferArray(record);
                }
                record.start();
                this.addToRecordingArray(record);
            }
            public stopRecord(key, desc) {
                var record = this.getSameFromRecordingArray(key);
                if (!record) {
                    Log.warn("未查询到执行中的record，key->" + key);
                    Log.warn("请先开始start record");
                    return;
                }
                record.stop(desc);
                this.removeFromRecordingArray(record);
                this.addToBufferArray(record);
            }
            //单例
            private static _TimeRecord: TimeRecord;
            public static getInstance() {
                if (TimeRecord._TimeRecord == null) {
                    TimeRecord._TimeRecord = new TimeRecord();
                }
                return TimeRecord._TimeRecord;
            }

        }
        //接口
        //开始记录
        export function start(key: string) {
            TimeRecord.getInstance().startRecord(key);
        }
        //停止记录
        export function stop(key: string, desc?: string) {
            TimeRecord.getInstance().stopRecord(key, desc);
        }

    }


    /**
     * 界面控制器
     * @platform Web,Native
     */
    export class StageManager {
        public static layerArray: Array<eui.Component> = [];
        //当前stage
        public static get stage(): egret.Stage {
            return egret.MainContext.instance.stage;
        };
        //添加显示节点
        public static popDisplayObjectContainer(db: any, zOrder?: number) {
            var stage = egret.MainContext.instance.stage;
            StageManager.layerArray.push(db);
            if (zOrder) {
                stage.addChildAt(db, zOrder);
                return;
            }
            stage.addChild(db);
        }
        //删除显示节点
        public static removeDisplayObjContainerByName(dbName: string): void {
            var stage = egret.MainContext.instance.stage;
            var db: any = stage.getChildByName(dbName);
            if (!db) return;
            for (var i = 0; i < StageManager.layerArray.length; i++) {
                var lay = StageManager.layerArray[i];
                if (lay.name == db.name) {
                    StageManager.layerArray.splice(i, 1);
                }
            }
            stage.removeChild(db);
        }
        //获取显示节点
        public static removeDisplayObjContainer(db: any): void {
            var stage = egret.MainContext.instance.stage;
            if (!db.stage) {
                console.error("传入了错误的显示容器->" + db);
                return;
            }
            for (var i = 0; i < StageManager.layerArray.length; i++) {
                var lay = StageManager.layerArray[i];
                if (lay.name == db.name) {
                    StageManager.layerArray.splice(i, 1);
                }
            }
            stage.removeChild(db);
        }
        //获取显示节点
        public static getDisplayObjContainerByName(dbName: string): any {
            var stage = egret.MainContext.instance.stage;
            var db: any = stage.getChildByName(dbName);
            if (!db) return;
            return db;
        }
        public static clear() {
            var stage = egret.MainContext.instance.stage;
            stage.removeChildren();
            StageManager.layerArray.length = 0;
        }
    }

    /**
     * 本地存档工具   //后期进行优化，进行加密和解密的处理
     * @platform Web,Native
     */
    export class DataStore {
        //读取链接数据
        public static getLinkData(name: string) {
            if (PlatUntils.isNative) return;
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return (r[2]); return null;
        }
        //写入数据
        public static writeLocalData(key: string, value: string) {
            egret.localStorage.setItem(key, value);
        }
        //读取数据
        public static readLocalData(key: string, defaultValue?: string): string {
            if (defaultValue == undefined || defaultValue == null) defaultValue = "";
            var value = egret.localStorage.getItem(key);
            return (value == "" || value == undefined || value == null) ? defaultValue : value;
        }
        //移除数据
        public static removeLocalData(key: string) {
            egret.localStorage.removeItem(key);
        }
    }

}
import pg = pigeon;