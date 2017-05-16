var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var pigeon;
(function (pigeon) {
    /**
     * author Tt.
     * 使用说明
     * var org:<T> = new T();
     * var data:<T> = <T>Bake.bakeData(org);
     * 对数据进行拷贝
     * 注意：不要使用__作为function的命名
     */
    var Bake = (function () {
        function Bake() {
        }
        //复制数字
        Bake.bakeNumber = function (num) {
            var copyNumber = num;
            return copyNumber;
        };
        //复制字符串
        Bake.bakeString = function (str) {
            var copyStr = str;
            return copyStr;
        };
        //复制boolean值
        Bake.bakeBoolean = function (bool) {
            var copyBool = bool;
            return copyBool;
        };
        //复制undfined
        Bake.bakeUndfined = function (un) {
            return un;
        };
        //复制object
        Bake.bakeObject = function (obj) {
            //object中可能会有数组
            if (obj instanceof Array) {
                return Bake.bakeArray(obj);
            }
            if (obj == null) {
                //还未测试对null的拷贝
                return null;
            }
            var data = {}; //可能为null
            for (var idx in obj) {
                if (idx.indexOf("__") != -1)
                    continue;
                data[idx] = Bake.bakeData(obj[idx]);
            }
            return data;
        };
        //复制数组
        Bake.bakeArray = function (arr) {
            var copyArr = [];
            for (var i = 0; i < arr.length; i++) {
                var dt = Bake.bakeData(arr[i]); //测试一次数组里面放object对象
                copyArr.push(dt);
            }
            return copyArr;
        };
        //复制方法
        Bake.bakeFunction = function (func) {
            return func;
        };
        //复制
        Bake.bakeData = function (data) {
            var copyData;
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
        };
        return Bake;
    }());
    Bake.object = "object";
    Bake.number = "number";
    Bake.string = "string";
    Bake.boolean = "boolean";
    Bake.undfined = "undfined";
    Bake.function = "function";
    pigeon.Bake = Bake;
    __reflect(Bake.prototype, "pigeon.Bake");
    //测试类
    var Auto = (function () {
        function Auto() {
            this.autoNum = 0;
        }
        Auto.prototype.add = function () {
            this.autoNum++;
            console.log("autoNum->" + this.autoNum);
        };
        return Auto;
    }());
    pigeon.Auto = Auto;
    __reflect(Auto.prototype, "pigeon.Auto");
    var TestRoleStruct = (function () {
        function TestRoleStruct(id, name) {
            this.id = id;
            this.name = name;
            this.arr = [new Auto()];
            this.testNull = null;
        }
        TestRoleStruct.prototype.show = function () {
            this.arr[0].add();
            this.id++;
            console.log(this.id + "->" + this.arr.length);
            console.log(this.testNull);
        };
        return TestRoleStruct;
    }());
    pigeon.TestRoleStruct = TestRoleStruct;
    __reflect(TestRoleStruct.prototype, "pigeon.TestRoleStruct");
    var test = (function () {
        function test() {
            var role1 = new TestRoleStruct(1, "one");
            var role2 = Bake.bakeData(role1);
            role1.show();
            role2.show();
        }
        return test;
    }());
    pigeon.test = test;
    __reflect(test.prototype, "pigeon.test");
})(pigeon || (pigeon = {}));
//# sourceMappingURL=Bake.js.map