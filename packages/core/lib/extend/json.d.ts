import Application from 'koa';
/**
 * json序列化扩展
 *
 * ```js
 * ctx.json({ msg:"hello from lin!" })
 * ```
 *
 * @param app app实例
 */
export declare const json: (app: Application<Application.DefaultState, Application.DefaultContext>) => void;
