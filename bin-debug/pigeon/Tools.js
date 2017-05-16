var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var pigeon;
(function (pigeon) {
    /**
     * Create By Tt. 2016/7/22
     * */
    /**
     * 消息打印
     * @platform Web,Native
     */
    var Log = (function () {
        function Log() {
        }
        //信息
        Log.info = function (msg) {
            console.info(msg);
        };
        //警告
        Log.warn = function (msg) {
            console.warn("%c" + msg, "color: purple;");
        };
        //错误
        Log.error = function (msg) {
            console.error(msg);
        };
        //debug专用
        Log.debug = function (msg) {
            if (!Log.isDebug)
                return;
            console.log("%c  " + msg, "color: green;");
        };
        Log.print = function (msg) {
            var print = function (msg, msg2) {
                if (msg instanceof Array) {
                    msg.forEach(print);
                }
                else if (msg instanceof Object) {
                    for (var idx in msg) {
                        print(idx, msg[idx]);
                    }
                }
                else if (msg2 || msg2 == 0) {
                    console.log(msg + "  " + msg2);
                }
                else {
                    console.log(msg);
                }
            };
            print(msg);
        };
        return Log;
    }());
    Log.isDebug = true;
    pigeon.Log = Log;
    __reflect(Log.prototype, "pigeon.Log");
    /**
     * 简化TOUCH_TAP的书写长度问题
     * @platform Web,Native
     */
    var TouchTap;
    (function (TouchTap) {
        // export function add(item:eui.Image,callback:Function, target:any);
        function add(item, callback, target) {
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
        TouchTap.add = add;
        function remove(item, callback, target) {
            if (!item) {
                return false;
            }
            item.removeEventListener(egret.TouchEvent.TOUCH_TAP, callback, target);
            return true;
        }
        TouchTap.remove = remove;
    })(TouchTap = pigeon.TouchTap || (pigeon.TouchTap = {}));
    /**
     * 使用pigeon.Timer 代替 egret.Timer 在游戏中更方便的进行 timer的注册和移除 （主要是移除方便）
     * @platform Web,Native
     */
    var Timer;
    (function (Timer) {
        var TimerStruct = (function () {
            function TimerStruct() {
            }
            return TimerStruct;
        }());
        Timer.TimerStruct = TimerStruct;
        __reflect(TimerStruct.prototype, "pigeon.Timer.TimerStruct");
        /**
         * 使用创建一个pigeon.Timer
         * @param delay 计时器事件间的延迟（以毫秒为单位）。建议 delay 不要低于 20 毫秒。计时器频率不得超过 60 帧/秒，这意味着低于 16.6 毫秒的延迟可导致出现运行时问题。
         * @param callback 调用的函数
         * @returns 返回一个pigeonTimer
         */
        function create(delay, callback, target) {
            var timer = new egret.Timer(delay);
            timer.addEventListener(egret.TimerEvent.TIMER, callback, target);
            timer.start();
            var timerStruct = new TimerStruct();
            timerStruct.timer = timer;
            timerStruct.callback = callback;
            timerStruct.target = target;
            return timerStruct;
        }
        Timer.create = create;
        function remove(timerStruct) {
            if (!timerStruct)
                return;
            if (timerStruct.timer) {
                timerStruct.timer.stop();
                timerStruct.timer.removeEventListener(egret.TimerEvent.TIMER, timerStruct.callback, timerStruct.target);
                timerStruct.timer = null;
            }
            timerStruct = null;
            return null;
        }
        Timer.remove = remove;
    })(Timer = pigeon.Timer || (pigeon.Timer = {}));
    /**
     * 使用异步加载替代同步加载，在H5版本中，可以不进行Group的加载。
     * @platform Web,Native
     */
    var Res;
    (function (Res) {
        function getVirtualUrl(path) {
            return RES.getVersionController().getVirtualUrl(path);
        }
        Res.getVirtualUrl = getVirtualUrl;
        function getRes(item, url) {
            if (!item) {
                Log.error("加载图片失败,传入了错误的item");
                return;
            }
            RES.getResAsync(url, function () {
                item.source = RES.getRes(url);
            }, this);
        }
        Res.getRes = getRes;
        //加载玩家头像
        function loadIcon(item, picUrl) {
            if (!item) {
                Log.error("加载玩家头像失败,传入了错误的item");
                return;
            }
            RES.getResByUrl(picUrl, function (data, url) {
                if (!data)
                    return;
                item.visible = false;
                item.texture = data;
            }, this, RES.ResourceItem.TYPE_IMAGE);
        }
        Res.loadIcon = loadIcon;
    })(Res = pigeon.Res || (pigeon.Res = {}));
    /**
     * 平台检测工具
     * @platform Web,Native
     */
    var PlatUntils = (function () {
        function PlatUntils() {
        }
        Object.defineProperty(PlatUntils, "isNative", {
            //判断是否是原生
            get: function () {
                return egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatUntils, "isMobile", {
            //判断是否是手机
            get: function () {
                return egret.Capabilities.isMobile;
            },
            enumerable: true,
            configurable: true
        });
        //判断是否是Android
        PlatUntils.isAndroid = function () {
            return PlatUntils.Platform == PlatUntils.PF_ANDROID;
        };
        //判断是否是IOS
        PlatUntils.isIos = function () {
            return PlatUntils.Platform == PlatUntils.PF_IOS;
        };
        Object.defineProperty(PlatUntils, "Platform", {
            /**平台判断*/
            get: function () {
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
                }
                else {
                    if (PlatUntils.browser.versions.android)
                        return PlatUntils.PF_ANDROID_H5;
                    if (PlatUntils.browser.versions.iPhone || PlatUntils.browser.versions.iPad)
                        return PlatUntils.PF_IOS_H5;
                    return PlatUntils.PF_PC;
                }
            },
            enumerable: true,
            configurable: true
        });
        return PlatUntils;
    }());
    /**平台*/
    PlatUntils.PF_PC = 1; //1-PC
    PlatUntils.PF_ANDROID = 2; //2-安卓
    PlatUntils.PF_IOS = 3; //3-苹果
    PlatUntils.PF_ANDROID_H5 = 4; //4-安卓H5
    PlatUntils.PF_IOS_H5 = 5; //5-苹果H5
    /**浏览器判断*/
    PlatUntils.browser = {
        versions: function () {
            if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE)
                return null;
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1,
                presto: u.indexOf('Presto') > -1,
                webKit: u.indexOf('AppleWebKit') > -1,
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
                iPad: u.indexOf('iPad') > -1,
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }()
    };
    pigeon.PlatUntils = PlatUntils;
    __reflect(PlatUntils.prototype, "pigeon.PlatUntils");
    /**
     * 游戏效率检测工具
     * @platform Web,Native
     */
    var Efficiency;
    (function (Efficiency) {
        var TimeRecordStruct = (function () {
            function TimeRecordStruct(key) {
                this.key = key;
                this.count = 0;
                this.startTime = 0;
                this.endTime = 0;
                this.costTime = 0;
                this.averageTime = 0;
            }
            //开始记录
            TimeRecordStruct.prototype.start = function () {
                this.count++;
                this.startTime = new Date().getTime();
            };
            //结束记录
            TimeRecordStruct.prototype.stop = function (desc) {
                if (!desc)
                    desc = "";
                this.endTime = new Date().getTime();
                this.costTime = this.endTime - this.startTime;
                this.averageTime = Math.round((this.averageTime * (this.count - 1) + this.costTime) / this.count);
                Log.debug(desc + "   key->" + this.key + "   此次花费时间->" + this.costTime + "ms    检测次数->"
                    + this.count + "    平均花费时间->" + this.averageTime + "ms");
            };
            return TimeRecordStruct;
        }());
        Efficiency.TimeRecordStruct = TimeRecordStruct;
        __reflect(TimeRecordStruct.prototype, "pigeon.Efficiency.TimeRecordStruct");
        var TimeRecord = (function () {
            function TimeRecord() {
                this.recordingArray = [];
                this.bufferArray = [];
            }
            TimeRecord.prototype.addToBufferArray = function (record) {
                this.bufferArray.push(record);
            };
            TimeRecord.prototype.removeFromBufferArray = function (record) {
                for (var i = 0; i < this.bufferArray.length; i++) {
                    var rd = this.bufferArray[i];
                    if (rd.key == record.key) {
                        this.bufferArray.splice(i, 1);
                        break;
                    }
                }
            };
            TimeRecord.prototype.getSameFromBufferArray = function (key) {
                var timeRecord;
                this.bufferArray.forEach(function (timerecord) {
                    if (timerecord.key == key) {
                        timeRecord = timerecord;
                    }
                });
                return timeRecord;
            };
            TimeRecord.prototype.addToRecordingArray = function (record) {
                this.recordingArray.push(record);
            };
            TimeRecord.prototype.removeFromRecordingArray = function (record) {
                for (var i = 0; i < this.recordingArray.length; i++) {
                    var rd = this.recordingArray[i];
                    if (rd.key == record.key) {
                        this.recordingArray.splice(i, 1);
                        break;
                    }
                }
            };
            TimeRecord.prototype.getSameFromRecordingArray = function (key) {
                var timeRecord;
                this.recordingArray.forEach(function (timerecord) {
                    if (timerecord.key == key) {
                        timeRecord = timerecord;
                    }
                });
                return timeRecord;
            };
            TimeRecord.prototype.startRecord = function (key) {
                var isSameRecording = this.getSameFromRecordingArray(key);
                if (isSameRecording) {
                    Log.warn("查询到重复的record，key->" + key);
                    Log.warn("请先停止上一个相同key的record");
                    return;
                }
                var record = this.getSameFromBufferArray(key);
                if (!record) {
                    record = new TimeRecordStruct(key);
                }
                else {
                    this.removeFromBufferArray(record);
                }
                record.start();
                this.addToRecordingArray(record);
            };
            TimeRecord.prototype.stopRecord = function (key, desc) {
                var record = this.getSameFromRecordingArray(key);
                if (!record) {
                    Log.warn("未查询到执行中的record，key->" + key);
                    Log.warn("请先开始start record");
                    return;
                }
                record.stop(desc);
                this.removeFromRecordingArray(record);
                this.addToBufferArray(record);
            };
            TimeRecord.getInstance = function () {
                if (TimeRecord._TimeRecord == null) {
                    TimeRecord._TimeRecord = new TimeRecord();
                }
                return TimeRecord._TimeRecord;
            };
            return TimeRecord;
        }());
        Efficiency.TimeRecord = TimeRecord;
        __reflect(TimeRecord.prototype, "pigeon.Efficiency.TimeRecord");
        //接口
        //开始记录
        function start(key) {
            TimeRecord.getInstance().startRecord(key);
        }
        Efficiency.start = start;
        //停止记录
        function stop(key, desc) {
            TimeRecord.getInstance().stopRecord(key, desc);
        }
        Efficiency.stop = stop;
    })(Efficiency = pigeon.Efficiency || (pigeon.Efficiency = {}));
    /**
     * 界面控制器
     * @platform Web,Native
     */
    var StageManager = (function () {
        function StageManager() {
        }
        Object.defineProperty(StageManager, "stage", {
            //当前stage
            get: function () {
                return egret.MainContext.instance.stage;
            },
            enumerable: true,
            configurable: true
        });
        ;
        //添加显示节点
        StageManager.popDisplayObjectContainer = function (db, zOrder) {
            var stage = egret.MainContext.instance.stage;
            StageManager.layerArray.push(db);
            if (zOrder) {
                stage.addChildAt(db, zOrder);
                return;
            }
            stage.addChild(db);
        };
        //删除显示节点
        StageManager.removeDisplayObjContainerByName = function (dbName) {
            var stage = egret.MainContext.instance.stage;
            var db = stage.getChildByName(dbName);
            if (!db)
                return;
            for (var i = 0; i < StageManager.layerArray.length; i++) {
                var lay = StageManager.layerArray[i];
                if (lay.name == db.name) {
                    StageManager.layerArray.splice(i, 1);
                }
            }
            stage.removeChild(db);
        };
        //获取显示节点
        StageManager.removeDisplayObjContainer = function (db) {
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
        };
        //获取显示节点
        StageManager.getDisplayObjContainerByName = function (dbName) {
            var stage = egret.MainContext.instance.stage;
            var db = stage.getChildByName(dbName);
            if (!db)
                return;
            return db;
        };
        StageManager.clear = function () {
            var stage = egret.MainContext.instance.stage;
            stage.removeChildren();
            StageManager.layerArray.length = 0;
        };
        return StageManager;
    }());
    StageManager.layerArray = [];
    pigeon.StageManager = StageManager;
    __reflect(StageManager.prototype, "pigeon.StageManager");
    /**
     * 本地存档工具   //后期进行优化，进行加密和解密的处理
     * @platform Web,Native
     */
    var DataStore = (function () {
        function DataStore() {
        }
        //读取链接数据
        DataStore.getLinkData = function (name) {
            if (PlatUntils.isNative)
                return;
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return (r[2]);
            return null;
        };
        //写入数据
        DataStore.writeLocalData = function (key, value) {
            egret.localStorage.setItem(key, value);
        };
        //读取数据
        DataStore.readLocalData = function (key, defaultValue) {
            if (defaultValue == undefined || defaultValue == null)
                defaultValue = "";
            var value = egret.localStorage.getItem(key);
            return (value == "" || value == undefined || value == null) ? defaultValue : value;
        };
        //移除数据
        DataStore.removeLocalData = function (key) {
            egret.localStorage.removeItem(key);
        };
        return DataStore;
    }());
    pigeon.DataStore = DataStore;
    __reflect(DataStore.prototype, "pigeon.DataStore");
})(pigeon || (pigeon = {}));
var pg = pigeon;
//# sourceMappingURL=Tools.js.map