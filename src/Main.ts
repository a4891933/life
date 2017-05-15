class Main extends egret.DisplayObjectContainer {
    public static resPath: string = "resource/default.res.json";
    public static resRoot: string = "resource/";
    public static thmPath: string = "resource/default.thm.json";
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    private onAddToStage(event: egret.Event) {
        var manage = pg.Loading.Manage;
        manage.setConfig(pg.Res.getVirtualUrl(Main.resPath)
            , pg.Res.getVirtualUrl(Main.thmPath), pg.Res.getVirtualUrl(Main.resRoot));
        manage.loading("preload", () => {
            this.createGameScene();
        }, null, this);
    }
    private createGameScene(): void {
        pg.StageManager.popDisplayObjectContainer(new nuan.MainView());
    }
}









