import { Context } from 'koa';
/**
 * 全局日志记录，且判断状态码，发出相应的异常
 * @description 目前使用该中间件前需要先把logger方法挂载到ctx上
 */
export declare const log: (ctx: Context, next: () => Promise<any>) => Promise<void>;
