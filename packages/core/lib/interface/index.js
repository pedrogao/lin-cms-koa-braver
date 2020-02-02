"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 记录信息的mixin
 */
exports.InfoCrudMixin = {
    attributes: {},
    options: {
        createdAt: 'create_time',
        updatedAt: 'update_time',
        deletedAt: 'delete_time',
        paranoid: true,
        getterMethods: {
            createTime() {
                // @ts-ignore
                return new Date(this.getDataValue('create_time')).getTime();
            },
            updateTime() {
                // @ts-ignore
                return new Date(this.getDataValue('update_time')).getTime();
            }
        }
    }
};
