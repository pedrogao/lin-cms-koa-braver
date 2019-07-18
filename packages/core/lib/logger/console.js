'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_logger_1 = require("egg-logger");
const utils = require('egg-logger/lib/utils');
const levels = require('egg-logger/lib/level');
const format_1 = require("./format");
/**
 * output log to console {@link Transport}。
 * specifical level by EGG_LOG has the highest priority
 */
class ConsoleTransport extends egg_logger_1.Transport {
    /**
     * @constructor
     * @param {Object} options
     * - {Array} [stderrLevel = ERROR] - output to stderr level, must higher than options.level
     */
    constructor(options) {
        super(options);
        this.options.stderrLevel = utils.normalizeLevel(this.options.stderrLevel);
    }
    get defaults() {
        // @ts-ignore
        return utils.assign(super.defaults, {
            stderrLevel: 'ERROR'
        });
    }
    /**
     * output log, see {@link Transport#log}
     * if stderrLevel presents, will output log to stderr
     * @param  {String} level - log level, in upper case
     * @param  {Array} args - all arguments
     * @param  {Object} meta - meta infomations
     */
    log(level, args, meta) {
        meta = meta || {};
        meta.formatter = format_1.consoleFormatter;
        const msg = super.log(level, args, meta);
        if (levels[level] >= this.options.stderrLevel &&
            levels[level] < levels['NONE']) {
            process.stderr.write(msg);
        }
        else {
            process.stdout.write(msg);
        }
    }
}
exports.ConsoleTransport = ConsoleTransport;
