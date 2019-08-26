import { config, log , error, multipart} from '@pedro/core'
import Application from 'koa';
import { Lin } from'./core'
const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const mount = require('koa-mount');
const serve = require('koa-static');
const fs = require('fs');
const path = require('path')
const Router = require('koa-router')

const router = new Router()

/**
 * 首页
 * @param app koa实例
 */
function indexPage (app:Application) {
  router.get('/', async ctx => {
    ctx.type = 'html';
    ctx.body = `<style type="text/css">*{ padding: 0; margin: 0; } div{ padding: 4px 48px;} a{color:#2E5CD5;cursor:
      pointer;text-decoration: none} a:hover{text-decoration:underline; } body{ background: #fff; font-family:
      "Century Gothic","Microsoft yahei"; color: #333;font-size:18px;} h1{ font-size: 100px; font-weight: normal;
      margin-bottom: 12px; } p{ line-height: 1.6em; font-size: 42px }</style><div style="padding: 24px 48px;"><p>
      Lin <br/><span style="font-size:30px">心上无垢，林间有风。</span></p></div> `;
  });
}

/**
 * 获取配置
 */
function applyConfig (app:Application) {
  app.context.config = config
  const cwd = process.cwd();
  const files = fs.readdirSync(path.resolve(`${cwd}/app/config`));
  for (const file of files) {
    config.getConfigFromFile(`app/config/${file}`);
  }
  // 加载其它配置文件
  config.getConfigFromFile('app/extensions/file/config.js');
}

/**
 * 跨域支持
 * @param app koa实例
 */
function applyCors (app:Application) {
  app.use(cors());
}

/**
 * 解析Body参数
 * @param app koa实例
 */
function applyBodyParse (app:Application) {
  // 参数解析
  app.use(KoaBodyParser());
}

/**
 * 静态资源服务
 * @param app koa实例
 * @param prefix 静态资源存放相对路径
 */
function applyStatic (app, prefix = '/assets') {
  const assetsDir = config.getItem('file.storeDir', 'app/static');
  app.use(mount(prefix, serve(assetsDir)));
}
/**
 * 初始化Koa实例
 */
async function createApp() {
  const app = new Koa();
  applyConfig(app)
  applyBodyParse(app);
  applyCors(app);
  applyStatic(app);
  const lin = new Lin();
  lin.initApp(app)
  app.use(log);
  app.on('error', error);
  indexPage(app)
  multipart(app);
  app
  .use(router.routes())
  .use(router.allowedMethods());
  return app
}

export { createApp, router }