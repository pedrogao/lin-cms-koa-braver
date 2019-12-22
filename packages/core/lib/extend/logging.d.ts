import Application from 'koa';
import { Logger } from 'egg-logger';
export declare const logger: Logger<{}>;
/**
 * ATTENTION: 需第一时间主动加载配置，然后将 logging 扩展第一时间挂载到ctx原型上
 * 日志扩展
 *
 * ```js
 * ctx.logger.info();
 * ctx.logger.warn();
 * ctx.logger.debug();
 * ctx.logger.error();
 * ```
 *
 * @param app app实例
 */
export declare const logging: (app: Application<Application.DefaultState, Application.DefaultContext>) => void;
