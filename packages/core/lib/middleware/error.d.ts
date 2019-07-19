import { Context } from 'koa';
/**
 * 全局异常处理中间件
 */
export declare const error: (err: Error, ctx: Context) => void;
