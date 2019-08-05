import assert from 'assert';
import { isInteger } from 'lodash';
import { Exception } from '../types'
/**
 * HttpException 是lin中所有其他异常的基类
 *
 * ```js
 * // 实例化一个默认的HttpException
 * const ex = new HttpException();
 *
 * // 实例化一个带参的HttpException
 * const ex = new HttpException({ msg: "想给你一个信息呢！" });
 *
 * // 也可以是其他参数
 * const ex = new HttpException({ errorCode: 10010 });
 *
 * // 也可以指定所有参数
 * const ex = new HttpException({ errorCode: 10010, msg: "想给你一个信息呢！", code: 200 });
 * ```
 */
export class HttpException extends Error {
  /**
   * http 状态码
   */
  public code: number = 500;

  /**
   * 返回的信息内容
   */
  public msg: any = '服务器未知错误';

  /**
   * 特定的错误码
   */
  public errorCode: number = 999;

  public fields: string[] = ['msg', 'errorCode'];

  /**
   * 构造函数
   * @param ex 可选参数，通过{}的形式传入
   */
  constructor(ex?: Exception) {
    super();
    if (ex && ex.code) {
      assert(isInteger(ex.code));
      this.code = ex.code;
    }
    if (ex && ex.msg) {
      this.msg = ex.msg;
    }
    if (ex && ex.errorCode) {
      assert(isInteger(ex.errorCode));
      this.errorCode = ex.errorCode;
    }
  }
}
