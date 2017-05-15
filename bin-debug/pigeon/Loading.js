var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var pigeon;
(function (pigeon) {
    var Loading;
    (function (Loading) {
        var Group = (function () {
            function Group() {
            }
            Group.prototype.setCallBack = function (compleCallBack, target, progressCallBack) {
                this.comple = compleCallBack;
                this.target = target;
                if (progressCallBack) {
                    this.progress = progressCallBack;
                }
            };
            return Group;
        }());
        Loading.Group = Group;
        __reflect(Group.prototype, "pigeon.Loading.Group");
        var Manage = (function () {
            function Manage() {
                var self = this;
                //场景
                self.stage = egret.MainContext.instance.stage;
                //资源加载
                var assetAdapter = new AssetAdapter();
                self.stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
                self.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
                //初始化数组
                self.groupArray = [];
                self.isInit = false;
                self.thmLoaded = false;
                self.resLoaded = false;
                self.isIniting = false;
                //初始化监听
                RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.groupLoadProgress, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.groupLoadComplete, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                //初始化配置文件
                RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.initThm, self);
            }
            //接口部分
            //创建一个group
            Manage.create = function (groupName, comple, progress, target) {
                if (comple === void 0) { comple = function () { }; }
                if (progress === void 0) { progress = function () { }; }
                if (target === void 0) { target = this; }
                var group = new Group();
                group.name = groupName;
                group.comple = comple;
                group.progress = progress;
                group.target = target;
                return group;
            };
            //组合两个group
            Manage.concat = function (groupA, groupB) {
                var gA = RES.getGroupByName(groupA);
                var gB = RES.getGroupByName(groupB);
                var arr = [];
                gA.forEach(function (element) {
                    arr.push(gA);
                });
                gB.forEach(function (element) {
                    arr.push(gB);
                });
                return RES.createGroup(groupA + "_" + groupB, arr);
            };
            //创建一个group
            Manage.loading = function (groupName, comple, progress, target) {
                if (comple === void 0) { comple = function () { }; }
                if (progress === void 0) { progress = function () { }; }
                if (target === void 0) { target = this; }
                var group = new Group();
                group.name = groupName;
                group.comple = comple;
                group.progress = progress;
                group.target = target;
                Manage.getIns().loadGroup(group);
                return group;
            };
            //设置基础config
            Manage.setConfig = function (config, thm, prefix) {
                Manage.resConfig = config;
                Manage.thmConfig = thm;
                Manage.resConfigPrefix = prefix;
            };
            //卸载config文件
            Manage.unConfig = function (callback, target) {
                RES.getResByUrl(Manage.resConfig, function (config) {
                    if (!config) {
                        console.log("找不到需要移除的Config文件");
                        return;
                    }
                    Manage.getIns().unConfig(config);
                    Manage.getIns().isInit = false;
                    Manage.getIns().thmLoaded = false;
                    Manage.getIns().resLoaded = false;
                    if (callback)
                        callback.call(target);
                }, this);
            };
            //获取一个加载资源结构
            Manage.getGroupStruct = function (groupName) {
                var group = new Group();
                group.name = groupName;
                return group;
            };
            //加载一个资源组
            Manage.loadGroup = function (group) {
                Manage.getIns().loadGroup(group);
            };
            //检测资源组是否加载
            Manage.isLoaded = function (groupName) {
                return Manage.getIns().isLoaded(groupName);
            };
            Manage.prototype.init = function () {
                var self = this;
                if (self.isInit)
                    return;
                if (self.isIniting)
                    return;
                self.isIniting = true;
                var configUrl = Manage.resConfig;
                RES.loadConfig(configUrl, Manage.resConfigPrefix);
            };
            Manage.prototype.initThm = function () {
                var self = this;
                //初始化皮肤文件\
                if (Manage.thmConfig) {
                    var thmUrl;
                    if (!pigeon.PlatUntils.isNative) {
                        thmUrl = Manage.thmConfig + "?version=" + new Date().getTime();
                    }
                    else {
                        thmUrl = RES.getVersionController().getVirtualUrl(Manage.thmConfig);
                    }
                    var theme = new eui.Theme(thmUrl, self.stage);
                    theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                        self.thmLoaded = true;
                        self.isInit = true;
                        self.isIniting = false;
                        self.resLoadGroup();
                    }, self);
                }
                else {
                    self.thmLoaded = true;
                    self.isInit = true;
                    self.isIniting = false;
                }
                self.resLoaded = true;
                self.resLoadGroup();
            };
            //加载部分
            Manage.prototype.loadGroup = function (group) {
                var self = this;
                self.groupArray.push(group);
                self.resLoadGroup();
            };
            //组是否已经加载完
            Manage.prototype.isLoaded = function (groupName) {
                return RES.isGroupLoaded(groupName);
            };
            Manage.prototype.resLoadGroup = function () {
                var self = this;
                if (!self.isInit) {
                    self.init();
                    return;
                }
                if (!self.resLoaded || !self.thmLoaded)
                    return;
                var group = self.groupArray.shift();
                if (!group)
                    return;
                var loadGroup;
                if (typeof group == "string") {
                    loadGroup = new Group();
                    loadGroup.name = group;
                }
                else {
                    loadGroup = group;
                }
                self.loadingGroup = loadGroup;
                RES.loadGroup(loadGroup.name);
            };
            //加载完成
            Manage.prototype.groupLoadComplete = function (event) {
                var self = this;
                var group = self.loadingGroup;
                if (!group)
                    return;
                if (group.name != event.groupName)
                    return;
                self.loadingGroup = null;
                if (group.comple) {
                    group.comple.call(group.target, event);
                }
                if (self.groupArray.length == 0)
                    return;
                self.resLoadGroup();
            };
            //加载进度
            Manage.prototype.groupLoadProgress = function (event) {
                var self = this;
                var group = self.loadingGroup;
                if (!group)
                    return;
                if (group.name != event.groupName)
                    return;
                if (group.progress) {
                    group.progress.call(group.target, event);
                }
            };
            //加载错误
            Manage.prototype.onItemLoadError = function (event) {
                console.warn("Url:" + event.resItem.url + " has failed to load");
            };
            //加载错误
            Manage.prototype.onResourceLoadError = function (event) {
                console.warn("Group:" + event.groupName + " has failed to load");
                this.groupLoadComplete(event); //忽略加载失败的项目
            };
            /**
            * config文件
            */
            Manage.prototype.unConfig = function (config) {
                var res = RES;
                var configInstance = res.configInstance;
                var groups = config.groups;
                var resources = config.resources;
                var len = groups.length;
                var obj;
                var subkeys;
                var subkeysLen;
                for (var i = 0; i < len; i++) {
                    obj = groups[i];
                    RES.destroyRes(obj.name);
                    delete configInstance.groupDic[obj.name];
                }
                len = resources.length;
                for (var i = 0; i < len; i++) {
                    obj = resources[i];
                    subkeys = obj.subkeys;
                    delete configInstance.keyMap[obj.name];
                    if (subkeys == null)
                        continue;
                    subkeysLen = subkeys.length;
                    for (var j = 0; j < subkeysLen; j++) {
                        delete configInstance.keyMap[subkeys[j]];
                    }
                }
            };
            Manage.getIns = function () {
                Manage.instance = new Manage();
                Manage.getIns = function () {
                    return Manage.instance;
                };
                return Manage.instance;
            };
            return Manage;
        }());
        //初始化部分
        Manage.resConfig = "";
        Manage.resConfigPrefix = "";
        Manage.thmConfig = "";
        Loading.Manage = Manage;
        __reflect(Manage.prototype, "pigeon.Loading.Manage");
        //解析主题
        var ThemeAdapter = (function () {
            function ThemeAdapter() {
            }
            ThemeAdapter.prototype.getTheme = function (url, compFunc, errorFunc, thisObject) {
                function onGetRes(e) { compFunc.call(thisObject, e); }
                function onError(e) {
                    if (e.resItem.url != url)
                        return;
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                    errorFunc.call(thisObject);
                }
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
            };
            return ThemeAdapter;
        }());
        Loading.ThemeAdapter = ThemeAdapter;
        __reflect(ThemeAdapter.prototype, "pigeon.Loading.ThemeAdapter", ["eui.IThemeAdapter"]);
        //解析素材
        var AssetAdapter = (function () {
            function AssetAdapter() {
            }
            AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
                function onGetRes(data) {
                    compFunc.call(thisObject, data, source);
                }
                if (!RES.hasRes(source)) {
                    RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
                    return;
                }
                var data = RES.getRes(source);
                data ? onGetRes(data) : RES.getResAsync(source, onGetRes, this);
                // if (data) {
                //     onGetRes(data);
                // } else {
                //     RES.getResAsync(source, onGetRes, this);
                // }
            };
            return AssetAdapter;
        }());
        Loading.AssetAdapter = AssetAdapter;
        __reflect(AssetAdapter.prototype, "pigeon.Loading.AssetAdapter", ["eui.IAssetAdapter"]);
    })(Loading = pigeon.Loading || (pigeon.Loading = {}));
})(pigeon || (pigeon = {}));
