module pigeon {
    /**
     * author Tt.
     * 使用说明
     * var org:<T> = new T();
     * var data:<T> = <T>Bake.bakeData(org);
     * 对数据进行拷贝
     * 注意：不要使用__作为function的命名
     */
    export class Bake {
        private static object = "object";
        private static number = "number";
        private static string = "string";
        private static boolean = "boolean";
        private static undfined = "undfined";
        private static function = "function";
        //复制数字
        private static bakeNumber(num: number) {
            var copyNumber = num;
            return copyNumber;
        }
        //复制字符串
        private static bakeString(str: string) {
            var copyStr = str;
            return copyStr;
        }
        //复制boolean值
        private static bakeBoolean(bool: boolean) {
            var copyBool = bool;
            return copyBool;
        }
        //复制undfined
        private static bakeUndfined(un) {
            return un;
        }
        //复制object
        private static bakeObject(obj: any) {
            //object中可能会有数组
            if (obj instanceof Array) {
                return Bake.bakeArray(obj);
            }
            if (obj == null) {
                //还未测试对null的拷贝
                return null;
            }
            var data: any = {};//可能为null
            for (var idx in obj) {
                if (idx.indexOf("__") != -1) continue;
                data[idx] = Bake.bakeData(obj[idx]);
            }
            return data;
        }
        //复制数组
        private static bakeArray(arr: Array<any>) {
            var copyArr: Array<any> = [];
            for (var i = 0; i < arr.length; i++) {
                var dt = Bake.bakeData(arr[i]);//测试一次数组里面放object对象
                copyArr.push(dt);
            }
            return copyArr;
        }
        //复制方法
        private static bakeFunction(func: Function) {
            return func;
        }
        //复制
        public static bakeData(data: any): any {
            var copyData: any;
            switch (typeof data) {
                case Bake.object:
                    copyData = Bake.bakeObject(data);
                    break;
                case Bake.number:
                    copyData = Bake.bakeNumber(data);
                    break;
                case Bake.string:
                    copyData = Bake.bakeString(data);
                    break;
                case Bake.boolean:
                    copyData = Bake.bakeBoolean(data);
                    break;
                case Bake.undfined:
                    copyData = Bake.bakeUndfined(data);
                    break;
                case Bake.function:
                    copyData = Bake.bakeFunction(data);
                    break;
            }
            return copyData;
        }
    }


    //测试类
    export class Auto{
        public autoNum;
        constructor(){
            this.autoNum = 0;
        }
        public add (){
            this.autoNum++;
            console.log("autoNum->"+ this.autoNum);
        }
    }

    export class TestRoleStruct {
        public id: number;
        public name: string;
        public arr: Array<Auto>;
        public testNull: number;
        constructor(id: number, name: string) {
            this.id = id;
            this.name = name;
            this.arr = [new Auto()];
            this.testNull = null;
       }
        public show() {
            this.arr[0].add();
            this.id++;
            console.log(this.id + "->" + this.arr.length);
            console.log(this.testNull);
        }
    }
    export class test {
        constructor() {
            var role1 = new TestRoleStruct(1, "one");
            var role2 = Bake.bakeData(role1);
            role1.show();
            role2.show();
        }
    }
}