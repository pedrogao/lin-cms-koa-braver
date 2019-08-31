import Router, { IRouterOptions, IMiddleware } from 'koa-router';
import { Meta } from '../types/index';
export declare const routeMetaInfo: Map<any, any>;
/**
 * lin-router继承自koa-router
 * 即可使用全部的koa-router api
 * 也可使用以 lin 为前缀的方法，用于视图函数的权限
 */
export declare class LinRouter extends Router {
    constructor(linRouterrOptions?: IRouterOptions);
    linOption(name: string, path: string | RegExp, meta?: Meta, ...middleware: IMiddleware[]): Router<any, {}>;
    linHead(name: string, path: string | RegExp, meta?: Meta, ...middleware: IMiddleware[]): Router<any, {}>;
    linGet(name: string, path: string | RegExp, meta?: Meta, ...middleware: IMiddleware[]): Router<any, {}>;
    linPut(name: string, path: string | RegExp, meta?: Meta, ...middleware: IMiddleware[]): Router<any, {}>;
    linPatch(name: string, path: string | RegExp, meta?: Meta, ...middleware: IMiddleware[]): Router<any, {}>;
    linPost(name: string, path: string | RegExp, meta?: Meta, ...middleware: IMiddleware[]): Router<any, {}>;
    linDelete(name: string, path: string | RegExp, meta?: Meta, ...middleware: IMiddleware[]): Router<any, {}>;
}
