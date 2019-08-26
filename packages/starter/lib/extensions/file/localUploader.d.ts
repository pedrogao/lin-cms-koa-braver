declare const Uploader: any;
declare const config: any;
declare const fs: any;
declare const path: any;
declare class LocalUploader extends Uploader {
    /**
     * 处理文件对象
     * { size, encoding, fieldname, filename, mimeType, data }
     */
    upload(files: any): Promise<never[]>;
}
