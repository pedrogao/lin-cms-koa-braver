import { router } from './app';
declare const LocalUploader: any;
/**
 * 启动Koa实例
 * @param port 启动端口
 */
declare const run: () => Promise<void>;
export { run, LocalUploader, router };
