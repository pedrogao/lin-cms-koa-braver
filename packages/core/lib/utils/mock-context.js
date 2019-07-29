'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const stream_1 = tslib_1.__importDefault(require("stream"));
const koa_1 = tslib_1.__importDefault(require("koa"));
exports.context = (req, res, app) => {
    const socket = new stream_1.default.Duplex();
    req = Object.assign({
        headers: {},
        socket
    }, stream_1.default.Readable.prototype, req);
    res = Object.assign({
        _headers: {},
        socket
    }, stream_1.default.Writable.prototype, res);
    // @ts-ignore
    req.socket.remoteAddress = req.socket.remoteAddress || '127.0.0.1';
    app = app || new koa_1.default();
    // @ts-ignore
    res.getHeader = k => res._headers[k.toLowerCase()];
    // @ts-ignore
    res.setHeader = (k, v) => (res._headers[k.toLowerCase()] = v);
    // @ts-ignore
    res.removeHeader = (k, v) => delete res._headers[k.toLowerCase()];
    // @ts-ignore
    return app.createContext(req, res);
};
exports.request = (req, res, app) => exports.context(req, res, app).request;
exports.response = (req, res, app) => exports.context(req, res, app).response;
