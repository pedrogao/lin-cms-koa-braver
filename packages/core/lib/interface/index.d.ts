/**
 * 记录信息的mixin
 */
export declare let InfoCrudMixin: {
    attributes: {};
    options: {
        createdAt: string;
        updatedAt: string;
        deletedAt: string;
        paranoid: boolean;
        getterMethods: {
            createTime(): any;
            updateTime(): any;
        };
    };
};
