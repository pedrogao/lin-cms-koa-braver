import { Transport } from 'egg-logger';
/**
 * output log to console {@link Transport}。
 * specifical level by EGG_LOG has the highest priority
 */
export declare class ConsoleTransport extends Transport {
    options: any;
    /**
     * @constructor
     * @param {Object} options
     * - {Array} [stderrLevel = ERROR] - output to stderr level, must higher than options.level
     */
    constructor(options: any);
    get defaults(): any;
    /**
     * output log, see {@link Transport#log}
     * if stderrLevel presents, will output log to stderr
     * @param  {String} level - log level, in upper case
     * @param  {Array} args - all arguments
     * @param  {Object} meta - meta infomations
     */
    log(level: any, args: any, meta: any): void;
}
