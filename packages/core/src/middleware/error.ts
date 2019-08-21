import { Context } from 'koa';
import { HttpException } from '../exception';
import { logger } from '../extend';
import { config } from '../config';
/**
 * 全局异常处理中间件
 */
export const error = (err: Error, ctx: Context) => {
  ctx.type = 'application/json';
  if (err instanceof HttpException) {
    ctx.status = err.code || 500;
    ctx.body = JSON.stringify({
      error_code: err.errorCode,
      msg: err.msg,
      url: ctx.req.url
    });
  } else {
    logger.error(err);
    if (config.isDebug()) {
      ctx.body = JSON.stringify(err);
    } else {
      ctx.body = JSON.stringify({
        error_code: 999,
        msg: '服务器未知错误',
        url: ctx.req.url
      });
    }
  }
};

