const { config } = require('@pedro/core');

// 初始化数据库配置
// 初始化数据库配置
(() => {
  const settings = require('../../app/config/setting');
  const secure = require('../../app/config/secure');
  config.getConfigFromObj({
    ...settings,
    ...secure
  });
})();
