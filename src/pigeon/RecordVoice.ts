module pigeon {
    export class RecordConstant {
        public static start = "record_start_req_from_ts";
        public static stop = "record_stop_req_from_ts";
        public static cancel = "record_cancel_req_from_ts";
        public static play = "record_play_req_from_ts";
        public static play_fish = "record_play_finish_resp_from_native";
        public static stop_success = "record_stop_resp_from_native";
    }
    export class RecordUtil {
        private isRecording: boolean;
        private isPlaying: boolean;
        public get playing(): boolean {
            return this.isPlaying;
        }
        public get recording(): boolean {
            return this.isRecording;
        }

        //接口列表
        public start() {
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
        }
        public stop(callback: Function, target: any) {
            this._stop(callback, target);
        }

        public cancel() {
            this._cancel();
        }

        public play(msg: string) {
            this._addToPlay(msg);
        }

        public bindPlayFinishCallback(callback: Function, target: any) {
            this.finishCallBack = callback;
            this.finishTarget = target;
        }

        //内部实现
        private _start() {
            this.isRecording = true;
            egret.ExternalInterface.call(RecordConstant.start, RecordConstant.start);
        }
        private _stop(callback: Function, target: any) {
            this.callback = callback;
            this.target = target;
            egret.ExternalInterface.call(RecordConstant.stop, RecordConstant.stop);
        }
        private _cancel() {
            //强制进行结束 
            this.callback = null;
            this.target = null;
            egret.ExternalInterface.call(RecordConstant.stop, RecordConstant.stop);
        }

        //语音的播放
        private _playList: Array<string>;
        public _play() {
            if (this.isPlaying) {
                pg.Log.debug("_play this.isPlaying" + this.isPlaying);
                return;
            }
            if (this.isRecording) {
                //当在录音的时候有播放声音需求 进行延时处理
                pg.Log.debug("_play this.isRecording" + this.isRecording);
                var self = this;
                setTimeout(() => {
                    self._play();
                }, 500);
                return;
            }
            var firstMsg = this._playList.shift();
            if (!firstMsg) return;
            this.isPlaying = true;
            pg.Log.debug("_play startPlaying");
            egret.ExternalInterface.call(RecordConstant.play, firstMsg);
        }
        private _playFinish() {
            this.isPlaying = false;
            if (this.finishCallBack) {
                this.finishCallBack.call(this.finishTarget);
            }
            this._play();
        }

        private callback: Function;
        private target: any;
        private finishCallBack: Function;
        private finishTarget: any;
        constructor() {
            var self = this;
            this._playList = [];
            this._waitList = [];
            this._playedIdList = [];
            //监听事件
            egret.ExternalInterface.addCallback(RecordConstant.play_fish, function (message: string) {
                setTimeout(() => {
                    self._playFinish();
                }, 100);
            });

            egret.ExternalInterface.addCallback(RecordConstant.stop_success, function (message: string) {
                // console.log("msg->" + message);
                if (message && message.length > 100) {
                    var strArr = RecordStruct.encode(message);
                    strArr.forEach(str => {
                        if (self.callback) {
                            self.callback.call(self.target, str);
                        }
                    })
                }
                self.isRecording = false;
                self._play();
            });
        }
        //等待中的数据操作
        private _waitList: Array<string>;
        private _playedIdList: Array<string>;//去重使用
        private _addToPlay(msg: string) {
            var data = RecordStruct.string2Struct(msg);
            if (this._isPlayed(data.id)) return;
            //收到多个消息内容
            this._waitList.push(msg);
            this._check(data.id);
        }
        private _check(checkId: string) {
            var arr: Array<string> = [];
            this._waitList.forEach(msg => {
                if (RecordStruct.string2Struct(msg).id == checkId) {
                    arr.push(msg);
                }
            })
            arr.sort((A, B) => {
                return RecordStruct.string2Struct(A).val - RecordStruct.string2Struct(B).val
            });
            var isOver = true;
            var maxOne = arr[arr.length - 1];
            if (RecordStruct.string2Struct(maxOne).val != RecordStruct.string2Struct(maxOne).maxVal) {
                isOver = false;
            } else {
                for (var i = 0; i < arr.length; i++) {
                    if (i != RecordStruct.string2Struct(arr[i]).val - 1) isOver = false;
                }
            }
            if (!isOver) return;
            var msg = "";
            arr.forEach(data => {
                msg += RecordStruct.string2Struct(data).msg;
            });
            this._removeWaitById(checkId);
            this._playList.push(msg);
            this._playedIdList.push(checkId);
            this._play();
        }
        private _removeWaitById(id: string) {
            for (var i = 0; i < this._waitList.length; i++) {
                var msg = this._waitList[i];
                var data = RecordStruct.string2Struct(msg);
                if (data.id == id) {
                    this._waitList.splice(i, 1);
                    i--;
                }
            }
        }
        private _isPlayed(id: string) {
            var isSame = false;
            this._playedIdList.forEach(num => {
                if (num == id) true;
            })
            return isSame;
        }
        //单例
        private static instance: RecordUtil;
        public static getIns(): RecordUtil {
            if (!RecordUtil.instance) {
                RecordUtil.instance = new RecordUtil();
            }
            return RecordUtil.instance;
        }
    }
    //消息优化---发送消息发送id val/maxval 进行拼接，用于支持用户更大长度的语音播放。
    export class RecordStruct {
        //15000
        public id: string;//发送消息的唯一id
        public val: number;//当前序数
        public maxVal: number;//最大序数
        public msg: string;
        public static maxByteNum = 15000;

        public static encode(msg: string): Array<string> {
            var recordArr: Array<string> = [];
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
                    if (!S) break;
                    msg += S;
                }
                record.msg = msg;
                recordArr.push(RecordStruct.struct2String(record));
            }
            return recordArr;
        }
        public static decode(strArr: Array<string>): string {
            var msg = "";
            return msg;
        }
        public static struct2String(data: RecordStruct) {
            var str = "";
            str += data.id;
            str += "," + data.maxVal;
            str += "," + data.val;
            str += "," + data.msg;
            return str;
        }
        public static string2Struct(str: string): RecordStruct {
            var arr = str.split(",");
            var data = new RecordStruct();
            data.id = arr[0];
            data.maxVal = parseInt(arr[1]);
            data.val = parseInt(arr[2]);
            data.msg = arr[3];
            return data;
        }

        public static getRandId() {
            var rand1 = Math.round(Math.random() * 100) / 100 + 100;
            var nowTime = new Date().getTime();
            var rand2 = Math.round(Math.random() * 1000000) / 1000000;
            var str = "" + rand1 + nowTime + rand2;
            return str;
        }
    }
}





