# lin-cms-koa 重构策划书

> 本次重构的原则，保证 API 的不变，大刀阔斧的进行的架构和编排的改革。

## 结构重构

本次重构将 lin-cms-koa 分为三层：

- core 层：核心层，以不与`lin-cms`绑定，为`koa`服务的原则。

- starter 层：依托于 core，以不与`业务(service)`耦合，为`lin-cms`服务的原则。

- demo 层：依赖于 starter，以高可复用，高可定制，高可扩展为原则。

## 抽离 core

> 将扩展(extends)，中间件(middlewares)，logger，file 以及其它分开。

## 定制 starter

> lin-cms 的核心架构和逻辑层

## 实现 demo

> lin-cms 的具体业务实现

## 要求

1. typescript 必会

2. 大量 node.js 底层知识

3. lerna 包管理工具

4. 架构清晰
