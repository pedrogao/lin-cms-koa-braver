

const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const mount = require('koa-mount');
const serve = require('koa-static');
const { config } = require('@pedro/core')

// const Router = require('koa-router');
import Router from 'koa-router'

/**
 * 首页
 */
function indexPage (app) {
  app.context.manager.loader.mainRouter.get('/', async ctx => {
    ctx.type = 'html';
    ctx.body = `<style type="text/css">*{ padding: 0; margin: 0; } div{ padding: 4px 48px;} a{color:#2E5CD5;cursor:
      pointer;text-decoration: none} a:hover{text-decoration:underline; } body{ background: #fff; font-family:
      "Century Gothic","Microsoft yahei"; color: #333;font-size:18px;} h1{ font-size: 100px; font-weight: normal;
      margin-bottom: 12px; } p{ line-height: 1.6em; font-size: 42px }</style><div style="padding: 24px 48px;"><p>
      Lin <br/><span style="font-size:30px">心上无垢，林间有风。</span></p></div> `;
  });
}



/**
 * 跨域支持
 * @param app koa实例
 */
function applyCors (app) {
  app.use(cors());
}

/**
 * 解析Body参数
 * @param app koa实例
 */
function applyBodyParse (app) {
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
  applyBodyParse(app);
  applyCors(app);
  applyStatic(app);
  const { log, error, Lin, multipart } = require('@pedro/core');
  app.use(log);
  app.on('error', error);
  const lin = new Lin();
  await lin.initApp(app, true);
  indexPage(app)
  multipart(app);
  return app
}

module.exports = { createApp };