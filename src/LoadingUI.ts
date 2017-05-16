// class CollectionEventExample extends egret.Sprite {
//     constructor() {
//         super();
//         var arr = [2, 1, 3,1];
//         var arrayCollection = new eui.ArrayCollection();
//         arrayCollection.source = arr;
//         arrayCollection.addEventListener(eui.CollectionEvent.COLLECTION_CHANGE, this.onCollectionChange, this);
//         arrayCollection.addItem(5);//add
//         arrayCollection.addItemAt(6, 1);//add
//         arrayCollection.source.sort();
//         arrayCollection.refresh();//refersh
//         arrayCollection.removeItemAt(2);//remove
//         arrayCollection.removeAll();//remove
//         arrayCollection.source = [1, 2, 3];//reset
//         arrayCollection.replaceItemAt(7, 1);//replace
//         arrayCollection.source[1] = 8;
//         arrayCollection.itemUpdated(1);//update

//         this.initData();
//         this.refresh();
//         this.orgArray.push(4);
//         this.refresh();
//     }
//     private orgArray : Array<number>;
//     private initData () {
//         this.orgArray = [1,2,3];
//     }
//     private refresh () {
//         var self = this;
//         var arr = this.orgArray;
//         arr.forEach(element => {
//             var label = new eui.Label();
//             label.text = element.toString();
//             label.x = element * 100;
//             label.y = element * 100;
//             self.addChild(label);
//         });
//     }
//     private onCollectionChange(e: eui.CollectionEvent) {
//         switch (e.kind) {
//             case eui.CollectionEventKind.ADD:
//                 egret.log("arrayCollection add" + " " + e.currentTarget.source + " " + e.location);
//                 break;
//             case eui.CollectionEventKind.REFRESH:
//                 egret.log("arrayCollection refersh" + " " + e.currentTarget.source + " " + e.location);
//                 break;
//             case eui.CollectionEventKind.REMOVE:
//                 egret.log("arrayCollection remove" + " " + e.currentTarget.source + " " + e.location);
//                 break;
//             case eui.CollectionEventKind.REPLACE:
//                 egret.log("arrayCollection replace" + " " + e.currentTarget.source + " " + e.location);
//                 break;
//             case eui.CollectionEventKind.RESET:
//                 egret.log("arrayCollection reset" + " " + e.currentTarget.source + " " + e.location);
//                 break;
//             case eui.CollectionEventKind.UPDATE:
//                 egret.log("arrayCollection update" + " " + e.currentTarget.source + " " + e.location);
//                 break;
//         }
//     }
// }