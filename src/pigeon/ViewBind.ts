module pigeon {
    class BindBase {
        public id:number;
        public obj : any;
        public items : Array<string>;
        public callback : Function;
        public target : any;
    }
    export class ViewBind {
        private eventList : Array<any>;//监听列表
        private timer : SingleTimer;
        constructor(){
            //初始化监听列表
            this.eventList = [];
            //初始化计时器
            this.timer = SingleTimerCore.create(100,this.loop,this);
        }
        private loop (){
            //每次循环检测监听列表内容，对比差异 执行监听事件
            this.eventList.forEach(event=>{

            });
        }
        private addEvent() {
            //添加监听列表内容

            //进行第一遍的数据拷贝

        }
        private removeEvent () {
            //移除数据监听内容


            //移除数据的拷贝释放内存

        }
    }
}