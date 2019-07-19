/**
 * HttpException 类构造函数的参数接口
 */
export interface Exception {
    code?: number;
    msg?: any;
    errorCode?: number;
}
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
export declare class HttpException extends Error {
    /**
     * http 状态码
     */
    code: number;
    /**
     * 返回的信息内容
     */
    msg: any;
    /**
     * 特定的错误码
     */
    errorCode: number;
    fields: string[];
    /**
     * 构造函数
     * @param ex 可选参数，通过{}的形式传入
     */
    constructor(ex?: Exception);
}
