"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const lodash_1 = require("lodash");
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
class HttpException extends Error {
    /**
     * 构造函数
     * @param ex 可选参数，通过{}的形式传入
     */
    constructor(ex) {
        super();
        /**
         * http 状态码
         */
        this.code = 500;
        /**
         * 返回的信息内容
         */
        this.msg = '服务器未知错误';
        /**
         * 特定的错误码
         */
        this.errorCode = 999;
        this.fields = ['msg', 'errorCode'];
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.HttpException = HttpException;
