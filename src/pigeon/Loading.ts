module pigeon {
    export module Loading {
        export class Group {
            public name: string;
            public comple: Function;
            public progress: Function;
            public target: any;
            public setCallBack(compleCallBack: Function, target: any, progressCallBack?: Function) {
                this.comple = compleCallBack;
                this.target = target;
                if (progressCallBack) {
                    this.progress = progressCallBack;
                }
            }
        }
        export class Manage {
            //接口部分
            //创建一个group
            public static create (groupName:string,comple:Function = ()=>{},progress:Function = ()=>{},target:any = this) {
                var group = new Group();
                group.name = groupName;
                group.comple = comple;
                group.progress = progress;
                group.target = target;
                return group;
            }
            //组合两个group
            public static concat (groupA:string,groupB:string){
                var gA = RES.getGroupByName(groupA);
                var gB = RES.getGroupByName(groupB);
                var arr = [];
                gA.forEach(element=>{
                    arr.push(gA);
                })
                gB.forEach(element=>{
                    arr.push(gB);
                })
                return RES.createGroup(groupA + "_" + groupB,arr);
            } 
            //创建一个group
            public static loading (groupName:string,comple:Function = ()=>{},progress:Function = ()=>{},target:any = this) {
                var group = new Group();
                group.name = groupName;
                group.comple = comple;
                group.progress = progress;
                group.target = target;
                Manage.getIns().loadGroup(group);
                return group;
            }
            //设置基础config
            public static setConfig(config: string, thm: string, prefix: string) {
                Manage.resConfig = config;
                Manage.thmConfig = thm;
                Manage.resConfigPrefix = prefix;
            }
            //卸载config文件
            public static unConfig(callback: Function, target: any) {
                RES.getResByUrl(Manage.resConfig, (config) => {
                    if (!config) {
                        console.log("找不到需要移除的Config文件");
                        return;
                    }
                    Manage.getIns().unConfig(config);
                    Manage.getIns().isInit = false;
                    Manage.getIns().thmLoaded = false;
                    Manage.getIns().resLoaded = false;
                    if (callback) callback.call(target);
                }, this);
            }
            //获取一个加载资源结构
            public static getGroupStruct(groupName: string): Group {
                var group = new Group();
                group.name = groupName;
                return group;
            }
            //加载一个资源组
            public static loadGroup(group: Group) {
                Manage.getIns().loadGroup(group);
            }
            //检测资源组是否加载
            public static isLoaded(groupName: string): boolean {
                return Manage.getIns().isLoaded(groupName);
            }
            //初始化部分
            public static resConfig: string = "";
            public static resConfigPrefix: string = "";
            public static thmConfig: string = "";
            private stage: egret.Stage;
            private resLoaded: boolean;
            private thmLoaded: boolean;
            private isInit: boolean;
            private isIniting: boolean;
            constructor() {
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
            public init() {
                var self = this;
                if (self.isInit) return;
                if (self.isIniting) return;
                self.isIniting = true;
                var configUrl = Manage.resConfig;
                RES.loadConfig(configUrl, Manage.resConfigPrefix);
            }
            public initThm() {
                var self = this;
                //初始化皮肤文件\
                if (Manage.thmConfig) {
                    var thmUrl: string;
                    if (!PlatUntils.isNative) {
                        thmUrl = Manage.thmConfig + "?version=" + new Date().getTime();
                    } else {
                        thmUrl = RES.getVersionController().getVirtualUrl(Manage.thmConfig);
                    }
                    var theme = new eui.Theme(thmUrl, self.stage);
                    theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                        self.thmLoaded = true;
                        self.isInit = true;
                        self.isIniting = false;
                        self.resLoadGroup();
                    }, self);
                } else {
                    self.thmLoaded = true;
                    self.isInit = true;
                    self.isIniting = false;
                }
                self.resLoaded = true;
                self.resLoadGroup();
            }
            //加载部分
            public loadGroup(group: any) {
                var self = this;
                self.groupArray.push(group);
                self.resLoadGroup();
            }
            //组是否已经加载完
            public isLoaded(groupName: string) {
                return RES.isGroupLoaded(groupName);
            }
            //等待加载的group
            private groupArray: Array<any>;
            //加载中的group
            private loadingGroup: Group;
            private resLoadGroup() {
                var self = this;
                if (!self.isInit) {
                    self.init();
                    return;
                }
                if (!self.resLoaded || !self.thmLoaded) return;
                var group = self.groupArray.shift();
                if (!group) return;
                var loadGroup: Group;
                if (typeof group == "string") {
                    loadGroup = new Group();
                    loadGroup.name = group;
                } else {
                    loadGroup = group;
                }
                self.loadingGroup = loadGroup;
                RES.loadGroup(loadGroup.name);
            }
            //加载完成
            private groupLoadComplete(event: RES.ResourceEvent) {
                var self = this;
                var group = self.loadingGroup;
                if (!group) return;
                if (group.name != event.groupName) return;
                self.loadingGroup = null;
                if (group.comple) {
                    group.comple.call(group.target, event);
                }
                if (self.groupArray.length == 0) return;
                self.resLoadGroup();
            }
            //加载进度
            private groupLoadProgress(event: RES.ResourceEvent) {
                var self = this;
                var group = self.loadingGroup;
                if (!group) return;
                if (group.name != event.groupName) return;
                if (group.progress) {
                    group.progress.call(group.target, event);
                }
            }
            //加载错误
            private onItemLoadError(event: RES.ResourceEvent): void {
                console.warn("Url:" + event.resItem.url + " has failed to load");
            }
            //加载错误
            private onResourceLoadError(event: RES.ResourceEvent): void {
                console.warn("Group:" + event.groupName + " has failed to load");
                this.groupLoadComplete(event);//忽略加载失败的项目
            }

            /**
            * config文件
            */
            public unConfig(config: any): void {
                var res: any = RES;
                var configInstance: any = res.configInstance;

                var groups: any[] = config.groups;
                var resources: any[] = config.resources;

                var len: number = groups.length;
                var obj: any;
                var subkeys: string[];
                var subkeysLen: number;
                for (var i: number = 0; i < len; i++) {
                    obj = groups[i];
                    RES.destroyRes(obj.name);
                    delete configInstance.groupDic[obj.name];
                }

                len = resources.length;
                for (var i: number = 0; i < len; i++) {
                    obj = resources[i];
                    subkeys = obj.subkeys;
                    delete configInstance.keyMap[obj.name];
                    if (subkeys == null) continue;
                    subkeysLen = subkeys.length;
                    for (var j: number = 0; j < subkeysLen; j++) {
                        delete configInstance.keyMap[subkeys[j]];
                    }
                }
            }

            //单例部分
            private static instance: Manage;
            private static getIns() {
                Manage.instance = new Manage();
                Manage.getIns = function () {
                    return Manage.instance;
                }
                return Manage.instance;
            }
        }

        //解析主题
        export class ThemeAdapter implements eui.IThemeAdapter {
            public getTheme(url: string, compFunc: Function, errorFunc: Function, thisObject: any): void {
                function onGetRes(e: string): void { compFunc.call(thisObject, e); }
                function onError(e: RES.ResourceEvent): void {
                    if (e.resItem.url != url) return;
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                    errorFunc.call(thisObject);
                }
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
            }
        }
        //解析素材
        export class AssetAdapter implements eui.IAssetAdapter {
            public getAsset(source: string, compFunc: Function, thisObject: any): void {
                function onGetRes(data: any): void {
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
            }
        }
    }



}