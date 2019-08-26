'use strict';
const { LocalUploader, router } = require('@pedro/starter')

router.post('/cms/file', async ctx => {
  ctx.body = 'Hello World';
  const files = await ctx.multipart();
  console.log(files)
  if (files.length < 1) {
    throw new Error('未找到符合条件的文件资源');
  }
  const uploader = new LocalUploader('app/assets');
  const arr = await uploader.upload(files);
});
const { run } = require('@pedro/starter');

run();
