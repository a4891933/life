module pigeon {
	export abstract class BaseComponent extends eui.Component {
		private pre = "";
		protected dataProvider: eui.ArrayCollection;
		public constructor(skinName: string) {
			super();
			if (skinName) {
				this.skinName = this.pre + skinName;
			}
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		}
		abstract onEnter(): void;
		abstract onExit(): void;
	}
}