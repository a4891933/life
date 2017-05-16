module nuan {
	export class DetailBase {
		private detailName : string;
		private detailJson : any;
		public constructor(detailName:string) {
			this.detailName = detailName;
		}
		public init () {
			var str = "resource/config/" + this.detailName + ".json";
			this.detailJson = RES.getRes(pg.Res.getVirtualUrl(str));
		}
		public getAssetName(id:number){
			//通过id获取资源名称
			for(var i = 0 ; i < this.detailJson.length;i++){
				var data = this.detailJson[i];
				if(data.id == id){
					return data;
				}
			}
		}
	}
}