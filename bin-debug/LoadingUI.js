var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CollectionEventExample = (function (_super) {
    __extends(CollectionEventExample, _super);
    function CollectionEventExample() {
        var _this = _super.call(this) || this;
        var arr = [2, 1, 3, 1];
        var arrayCollection = new eui.ArrayCollection();
        arrayCollection.source = arr;
        arrayCollection.addEventListener(eui.CollectionEvent.COLLECTION_CHANGE, _this.onCollectionChange, _this);
        arrayCollection.addItem(5); //add
        return _this;
        // arrayCollection.addItemAt(6, 1);//add
        // arrayCollection.source.sort();
        // arrayCollection.refresh();//refersh
        // arrayCollection.removeItemAt(2);//remove
        // arrayCollection.removeAll();//remove
        // arrayCollection.source = [1, 2, 3];//reset
        // arrayCollection.replaceItemAt(7, 1);//replace
        // arrayCollection.source[1] = 8;
        // arrayCollection.itemUpdated(1);//update
    }
    CollectionEventExample.prototype.onCollectionChange = function (e) {
        switch (e.kind) {
            case eui.CollectionEventKind.ADD:
                egret.log("arrayCollection add" + " " + e.currentTarget.source + " " + e.location);
                break;
            case eui.CollectionEventKind.REFRESH:
                egret.log("arrayCollection refersh" + " " + e.currentTarget.source + " " + e.location);
                break;
            case eui.CollectionEventKind.REMOVE:
                egret.log("arrayCollection remove" + " " + e.currentTarget.source + " " + e.location);
                break;
            case eui.CollectionEventKind.REPLACE:
                egret.log("arrayCollection replace" + " " + e.currentTarget.source + " " + e.location);
                break;
            case eui.CollectionEventKind.RESET:
                egret.log("arrayCollection reset" + " " + e.currentTarget.source + " " + e.location);
                break;
            case eui.CollectionEventKind.UPDATE:
                egret.log("arrayCollection update" + " " + e.currentTarget.source + " " + e.location);
                break;
        }
    };
    return CollectionEventExample;
}(egret.Sprite));
__reflect(CollectionEventExample.prototype, "CollectionEventExample");
//# sourceMappingURL=LoadingUI.js.map