
'use strict';

import { config } from '@pedro/core'
import { createApp } from './app'
/**
 * 启动Koa实例
 * @param port 启动端口
 */
const run = async () => {
  const app = await createApp();
  const port = config.getItem('port');
  app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
  })
}

export {run}