"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const async_busboy_1 = tslib_1.__importDefault(require("async-busboy"));
const exception_1 = require("../exception/");
const path_1 = require("path");
const config_1 = require("../config");
/**
 * 解析上传文件
 * @param app app实例
 */
exports.multipart = (app) => {
    app.context.multipart = async function (opts) {
        // multipart/form-data
        if (!this.is('multipart')) {
            throw new Error('Content-Type must be multipart/*');
        }
        let filePromises = [];
        const { fields } = await async_busboy_1.default(this.req, {
            onFile: async function (fieldname, file, filename, encoding, mimetype) {
                const filePromise = new Promise((resolve, reject) => {
                    let bufs = [];
                    file
                        .on('error', err => {
                        file.resume();
                        reject(err);
                    })
                        .on('data', (d) => {
                        bufs.push(d);
                    })
                        .on('end', () => {
                        const buf = Buffer.concat(bufs);
                        resolve({
                            size: buf.length,
                            encoding: encoding,
                            fieldname: fieldname,
                            filename: filename,
                            mimeType: mimetype,
                            data: buf
                        });
                    });
                });
                filePromises.push(filePromise);
            }
        });
        let files = [];
        let totalSize = 0;
        for (const filePromise of filePromises) {
            let file;
            try {
                file = await filePromise;
            }
            catch (error) {
                throw new exception_1.HttpException({ msg: '文件体损坏，无法读取' });
            }
            const ext = path_1.extname(file.filename);
            if (!checkFileExtension(ext, opts && opts.include, opts && opts.exclude)) {
                throw new exception_1.FileExtensionException({ msg: `不支持类型为${ext}的文件` });
            }
            const { valid, conf } = checkSingleFileSize(file.size, opts && opts.singleLimit);
            if (!valid) {
                throw new exception_1.FileTooLargeException({
                    msg: `${file.filename}大小不能超过${conf}字节`
                });
            }
            // 计算总大小
            totalSize += file.size;
            files.push(file);
        }
        const { valid, conf } = checkFileNums(files.length, opts && opts.fileNums);
        if (!valid) {
            throw new exception_1.FileTooManyException({ msg: `上传文件数量不能超过${conf}` });
        }
        const { valid: valid1, conf: conf1 } = checkTotalFileSize(totalSize, opts && opts.totalLimit);
        if (!valid1) {
            throw new exception_1.FileTooLargeException({ msg: `总文件体积不能超过${conf1}` });
        }
        this.request.fields = fields;
        return files;
    };
};
function checkSingleFileSize(size, singleLimit) {
    // file_include,file_exclude,file_single_limit,file_total_limit,file_store_dir
    // 默认 2M
    const confSize = singleLimit
        ? singleLimit
        : config_1.config.getItem('file.singleLimit', 1024 * 1024 * 2);
    return {
        valid: confSize > size,
        conf: confSize
    };
}
function checkTotalFileSize(size, totalLimit) {
    // 默认 20M
    const confSize = totalLimit
        ? totalLimit
        : config_1.config.getItem('file.totalLimit', 1024 * 1024 * 20);
    return {
        valid: confSize > size,
        conf: confSize
    };
}
function checkFileNums(nums, fileNums) {
    // 默认 10
    const confNums = fileNums ? fileNums : config_1.config.getItem('file.nums', 10);
    return {
        valid: confNums > nums,
        conf: confNums
    };
}
function checkFileExtension(ext, include, exclude) {
    const fileInclude = include ? include : config_1.config.getItem('file.include');
    const fileExclude = exclude ? exclude : config_1.config.getItem('file.exclude');
    // 如果两者都有取fileInclude，有一者则用一者
    if (fileInclude && fileExclude) {
        if (!Array.isArray(fileInclude)) {
            throw new Error('file_include must an array!');
        }
        return fileInclude.includes(ext);
    }
    else if (fileInclude && !fileExclude) {
        // 有include，无exclude
        if (!Array.isArray(fileInclude)) {
            throw new Error('file_include must an array!');
        }
        return fileInclude.includes(ext);
    }
    else if (fileExclude && !fileInclude) {
        // 有exclude，无include
        if (!Array.isArray(fileExclude)) {
            throw new Error('file_exclude must an array!');
        }
        return !fileExclude.includes(ext);
    }
    else {
        // 二者都没有
        return true;
    }
}
