"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const exception_1 = require("../exception");
const lodash_1 = require("lodash");
/**
 * json序列化扩展
 *
 * ```js
 * ctx.json({ msg:"hello from lin!" })
 * ```
 *
 * @param app app实例
 */
exports.json = (app) => {
    /**
     * hide 表示想要隐藏的属性
     */
    app.context.json = function (obj, hide = []) {
        this.type = 'application/json';
        utils_1.unsets(obj, hide);
        let data = Object.create(null);
        if (obj instanceof exception_1.HttpException) {
            transform(obj, data);
            lodash_1.set(data, 'url', this.request.url);
            this.status = obj.code;
        }
        else {
            data = obj;
        }
        this.body = JSON.stringify(data);
    };
};
function transform(obj, data) {
    const fields = lodash_1.get(obj, 'fields', []);
    fields.forEach(field => {
        data[utils_1.toLine(field)] = lodash_1.get(obj, field);
    });
}
