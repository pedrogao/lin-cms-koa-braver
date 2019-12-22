import Application from 'koa';
/**
 * 处理success
 *
 * ```js
 * ctx.success({ msg:"hello from lin!" })
 * ```
 *
 * ```js
 * ctx.success({ code: 200, msg: "hello from lin!", errorCode: 10000 })
 * ```
 *
 * @param app app实例
 */
export declare const success: (app: Application<Application.DefaultState, Application.DefaultContext>) => void;
