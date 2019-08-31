import Application from 'koa';
import { logging, LinRouter } from '@pedro/core';
import consola from 'consola';
export class Lin {
  public async initApp(
    app: Application,
    mount?: boolean // 是否挂载插件路由
  ) {
    this['app'] = app;
    // 2. 默认扩展 json logger
    this.applyDefaultExtends();
    mount && this.mount();
  }
  private applyDefaultExtends() {
    logging(this['app']);
  }
  private mount() {
    console.log('挂载插件')
  }
}