import Application from 'koa';
export declare const __version__ = "0.2.3";
export declare const routeMetaInfo: Map<any, any>;
export declare const disableLoading: unique symbol;
/**
 * Lin核心类
 */
export declare class Lin {
    private app;
    /**
     * 初始化
     *
     * @param app koa app
     * @param mount 是否挂载路由
     */
    initApp(app: Application, mount?: boolean): Promise<void>;
    private mount;
}
