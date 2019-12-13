"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const consola_1 = tslib_1.__importDefault(require("consola"));
const utils_1 = require("./utils");
const extend_1 = require("./extend");
const jwt_1 = require("./jwt");
const loader_1 = require("./loader");
const router_1 = require("./router");
const lodash_1 = require("lodash");
const config_1 = require("./config");
// tslint:disable-next-line:variable-name
exports.__version__ = '0.2.3';
// 存放meta路由信息
exports.routeMetaInfo = new Map();
// 当前文件路由是否挂载
exports.disableLoading = Symbol('disableLoading');
/**
 * Lin核心类
 */
class Lin {
    /**
     * 初始化
     *
     * @param app koa app
     * @param mount 是否挂载路由
     */
    async initApp(app, mount) {
        this.app = app;
        this.app.context.config = config_1.config;
        utils_1.assert(!!this.app, 'app must not be null');
        // 2. 默认扩展 json logger
        this.applyDefaultExtends();
        // 3. manager
        this.applyManager();
        // 5. jwt
        this.applyJwt();
        // 6. 挂载默认路由
        mount && this.mount();
    }
    applyDefaultExtends() {
        extend_1.json(this.app);
        extend_1.logging(this.app);
        extend_1.success(this.app);
    }
    applyManager() {
        const manager = new Manager();
        this.manager = manager;
        const pluginPath = this.app.context.config.getItem('pluginPath');
        manager.initApp(this.app, pluginPath);
    }
    applyJwt() {
        const secret = this.app.context.config.getItem('secret');
        jwt_1.jwt.initApp(this.app, secret);
    }
    mount() {
        const pluginRp = new router_1.LinRouter({ prefix: '/plugin' });
        Object.values(this.manager.plugins).forEach(plugin => {
            consola_1.default.info(`loading plugin: ${lodash_1.get(plugin, 'name')}`);
            const controllers = Object.values(lodash_1.get(plugin, 'controllers'));
            if (controllers.length > 1) {
                controllers.forEach(cont => {
                    lodash_1.set(cont, 'opts.prefix', `/${lodash_1.get(plugin, 'name')}${lodash_1.get(cont, 'opts.prefix')}`);
                    lodash_1.get(cont, 'stack', []).forEach(ly => {
                        if (config_1.config.getItem('debug')) {
                            consola_1.default.info(`loading a route: /plugin/${lodash_1.get(plugin, 'name')}${lodash_1.get(ly, 'path')}`);
                        }
                        lodash_1.set(ly, 'path', `/${lodash_1.get(plugin, 'name')}${lodash_1.get(ly, 'path')}`);
                    });
                    pluginRp
                        .use(cont.routes())
                        .use(cont.allowedMethods());
                });
            }
            else {
                controllers.forEach(cont => {
                    if (config_1.config.getItem('debug')) {
                        lodash_1.get(cont, 'stack', []).forEach(ly => {
                            consola_1.default.info(`loading a route: /plugin${lodash_1.get(ly, 'path')}`);
                        });
                    }
                    pluginRp
                        .use(cont.routes())
                        .use(cont.allowedMethods());
                });
            }
        });
        this.app.use(pluginRp.routes()).use(pluginRp.allowedMethods());
    }
}
exports.Lin = Lin;
/**
 * 管理者
 * 管理插件
 */
class Manager {
    /**
     * 初始化
     * @param app koa app
     * @param pluginPath 插件路径
     */
    initApp(app, pluginPath) {
        app.context.manager = this;
        this.loader = new loader_1.Loader(pluginPath, app);
    }
    /**
     * 获取插件
     */
    get plugins() {
        return this.loader.plugins;
    }
}
