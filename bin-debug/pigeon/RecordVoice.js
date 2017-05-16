var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var pigeon;
(function (pigeon) {
    var RecordConstant = (function () {
        function RecordConstant() {
        }
        return RecordConstant;
    }());
    RecordConstant.start = "record_start_req_from_ts";
    RecordConstant.stop = "record_stop_req_from_ts";
    RecordConstant.cancel = "record_cancel_req_from_ts";
    RecordConstant.play = "record_play_req_from_ts";
    RecordConstant.play_fish = "record_play_finish_resp_from_native";
    RecordConstant.stop_success = "record_stop_resp_from_native";
    pigeon.RecordConstant = RecordConstant;
    __reflect(RecordConstant.prototype, "pigeon.RecordConstant");
    var RecordUtil = (function () {
        function RecordUtil() {
            var self = this;
            this._playList = [];
            this._waitList = [];
            this._playedIdList = [];
            //监听事件
            egret.ExternalInterface.addCallback(RecordConstant.play_fish, function (message) {
                setTimeout(function () {
                    self._playFinish();
                }, 100);
            });
            egret.ExternalInterface.addCallback(RecordConstant.stop_success, function (message) {
                // console.log("msg->" + message);
                if (message && message.length > 100) {
                    var strArr = RecordStruct.encode(message);
                    strArr.forEach(function (str) {
                        if (self.callback) {
                            self.callback.call(self.target, str);
                        }
                    });
                }
                self.isRecording = false;
                self._play();
            });
        }
        Object.defineProperty(RecordUtil.prototype, "playing", {
            get: function () {
                return this.isPlaying;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RecordUtil.prototype, "recording", {
            get: function () {
                return this.isRecording;
            },
            enumerable: true,
            configurable: true
        });
        //接口列表
        RecordUtil.prototype.start = function () {
            if (this.isRecording) {
                pg.Log.debug("start this.isRecording" + this.isRecording);
                this.cancel();
                return;
            }
            if (this.isPlaying) {
                pg.Log.debug("start this.isPlaying" + this.isPlaying);
                //播放的过程中调用了录音
                return;
            }
            this._start();
        };
        RecordUtil.prototype.stop = function (callback, target) {
            this._stop(callback, target);
        };
        RecordUtil.prototype.cancel = function () {
            this._cancel();
        };
        RecordUtil.prototype.play = function (msg) {
            this._addToPlay(msg);
        };
        RecordUtil.prototype.bindPlayFinishCallback = function (callback, target) {
            this.finishCallBack = callback;
            this.finishTarget = target;
        };
        //内部实现
        RecordUtil.prototype._start = function () {
            this.isRecording = true;
            egret.ExternalInterface.call(RecordConstant.start, RecordConstant.start);
        };
        RecordUtil.prototype._stop = function (callback, target) {
            this.callback = callback;
            this.target = target;
            egret.ExternalInterface.call(RecordConstant.stop, RecordConstant.stop);
        };
        RecordUtil.prototype._cancel = function () {
            //强制进行结束 
            this.callback = null;
            this.target = null;
            egret.ExternalInterface.call(RecordConstant.stop, RecordConstant.stop);
        };
        RecordUtil.prototype._play = function () {
            if (this.isPlaying) {
                pg.Log.debug("_play this.isPlaying" + this.isPlaying);
                return;
            }
            if (this.isRecording) {
                //当在录音的时候有播放声音需求 进行延时处理
                pg.Log.debug("_play this.isRecording" + this.isRecording);
                var self = this;
                setTimeout(function () {
                    self._play();
                }, 500);
                return;
            }
            var firstMsg = this._playList.shift();
            if (!firstMsg)
                return;
            this.isPlaying = true;
            pg.Log.debug("_play startPlaying");
            egret.ExternalInterface.call(RecordConstant.play, firstMsg);
        };
        RecordUtil.prototype._playFinish = function () {
            this.isPlaying = false;
            if (this.finishCallBack) {
                this.finishCallBack.call(this.finishTarget);
            }
            this._play();
        };
        RecordUtil.prototype._addToPlay = function (msg) {
            var data = RecordStruct.string2Struct(msg);
            if (this._isPlayed(data.id))
                return;
            //收到多个消息内容
            this._waitList.push(msg);
            this._check(data.id);
        };
        RecordUtil.prototype._check = function (checkId) {
            var arr = [];
            this._waitList.forEach(function (msg) {
                if (RecordStruct.string2Struct(msg).id == checkId) {
                    arr.push(msg);
                }
            });
            arr.sort(function (A, B) {
                return RecordStruct.string2Struct(A).val - RecordStruct.string2Struct(B).val;
            });
            var isOver = true;
            var maxOne = arr[arr.length - 1];
            if (RecordStruct.string2Struct(maxOne).val != RecordStruct.string2Struct(maxOne).maxVal) {
                isOver = false;
            }
            else {
                for (var i = 0; i < arr.length; i++) {
                    if (i != RecordStruct.string2Struct(arr[i]).val - 1)
                        isOver = false;
                }
            }
            if (!isOver)
                return;
            var msg = "";
            arr.forEach(function (data) {
                msg += RecordStruct.string2Struct(data).msg;
            });
            this._removeWaitById(checkId);
            this._playList.push(msg);
            this._playedIdList.push(checkId);
            this._play();
        };
        RecordUtil.prototype._removeWaitById = function (id) {
            for (var i = 0; i < this._waitList.length; i++) {
                var msg = this._waitList[i];
                var data = RecordStruct.string2Struct(msg);
                if (data.id == id) {
                    this._waitList.splice(i, 1);
                    i--;
                }
            }
        };
        RecordUtil.prototype._isPlayed = function (id) {
            var isSame = false;
            this._playedIdList.forEach(function (num) {
                if (num == id)
                    true;
            });
            return isSame;
        };
        RecordUtil.getIns = function () {
            if (!RecordUtil.instance) {
                RecordUtil.instance = new RecordUtil();
            }
            return RecordUtil.instance;
        };
        return RecordUtil;
    }());
    pigeon.RecordUtil = RecordUtil;
    __reflect(RecordUtil.prototype, "pigeon.RecordUtil");
    //消息优化---发送消息发送id val/maxval 进行拼接，用于支持用户更大长度的语音播放。
    var RecordStruct = (function () {
        function RecordStruct() {
        }
        RecordStruct.encode = function (msg) {
            var recordArr = [];
            var arr = msg.split("");
            var id = RecordStruct.getRandId();
            var maxVal = Math.ceil(msg.length / RecordStruct.maxByteNum);
            for (var i = 0; i < maxVal; i++) {
                var record = new RecordStruct();
                record.id = id;
                record.val = i + 1;
                record.maxVal = maxVal;
                var msg = "";
                for (var j = i * RecordStruct.maxByteNum; j < (i + 1) * RecordStruct.maxByteNum; j++) {
                    var S = arr[j];
                    if (!S)
                        break;
                    msg += S;
                }
                record.msg = msg;
                recordArr.push(RecordStruct.struct2String(record));
            }
            return recordArr;
        };
        RecordStruct.decode = function (strArr) {
            var msg = "";
            return msg;
        };
        RecordStruct.struct2String = function (data) {
            var str = "";
            str += data.id;
            str += "," + data.maxVal;
            str += "," + data.val;
            str += "," + data.msg;
            return str;
        };
        RecordStruct.string2Struct = function (str) {
            var arr = str.split(",");
            var data = new RecordStruct();
            data.id = arr[0];
            data.maxVal = parseInt(arr[1]);
            data.val = parseInt(arr[2]);
            data.msg = arr[3];
            return data;
        };
        RecordStruct.getRandId = function () {
            var rand1 = Math.round(Math.random() * 100) / 100 + 100;
            var nowTime = new Date().getTime();
            var rand2 = Math.round(Math.random() * 1000000) / 1000000;
            var str = "" + rand1 + nowTime + rand2;
            return str;
        };
        return RecordStruct;
    }());
    RecordStruct.maxByteNum = 15000;
    pigeon.RecordStruct = RecordStruct;
    __reflect(RecordStruct.prototype, "pigeon.RecordStruct");
})(pigeon || (pigeon = {}));
//# sourceMappingURL=RecordVoice.js.map