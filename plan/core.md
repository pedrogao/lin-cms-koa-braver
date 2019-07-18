# core 核心库重构

> 参考原来的版本 https://github.com/TaleLin/lin-cms-koa-core  
> 注意写单测

## config 模块

提供配置的导入，目前仅支持`.js`文件，考虑支持`.json`和`.yml`文件

支持从环境变量中导入配置，配置格式为`LIN_FILE_LIMIT`，前缀为`LIN`防止与其它环境
变量混淆

支持通过`LIN_ENV`的值去导入何种环境配置

## logger 模块

console 部分

file 部分

暂无更改

## extend 扩展

`logging`，`multipart`，`success`，`json`等 ctx 上的扩展。

## middleware 中间价

`error`全局异常处理，`logger`中间件

> 注意，在 middleware 和 extend 慎用异常，不要乱抛，会影响中间件的执行循序

## lin-router

扩展的 koa-router，权限机制

## plugin 插件

插件的加载

## lin-validator 校验器

自制的校验器机制

## jwt 令牌

灵活的 jwt 颁发和校验

## 其它
