import Application from 'koa';
import { logging } from '@pedro/core';
export class Lin {
  public async initApp(
    app: Application
  ) {
    this['app'] = app;
    // 2. 默认扩展 json logger
    this.applyDefaultExtends();
  }
  private applyDefaultExtends() {
    logging(this['app']);
  }
}