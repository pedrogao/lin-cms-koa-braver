'use strict';

const { config } = require('@pedro/core');
const fs = require('fs');

// 1. 必须最开始加载配置，因为其他很多扩展依赖于配置
// TODO 相对位置
function applyConfig () {
  const cwd = process.cwd();
  const files = fs.readdirSync(`${cwd}/app/config`);
  for (const file of files) {
    config.getConfigFromFile(`app/config/${file}`);
  }
}

const run = async () => {
  applyConfig();
  const { createApp } = require('./app');
  const app = await createApp();
  const port = config.getItem('port');
  app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
  })
}

run()