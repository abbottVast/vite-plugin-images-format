# vite-plugin-images-format 

vite插件: 把png,jpg图片压缩并转换成webp或avif格式,并替换文件引用路径

## 用法
```bash
npm install vite-plugin-images-format -D
```

```javascript
import imagesFormat from 'vite-plugin-images-format';

export default defineConfig({
  plugins: [
      imagesFormat({
        entry: resolve(__dirname, './src/public/images'),  //入口目录
        outDir: resolve(__dirname, 'src/public/images/artifact'),  //输入目录，建议将目录加入忽略文件，不用提交转化后的图片到仓库, //输出目录
        imageType: ['.png', '.jpg'], //处理图片类型
        sharpType: 'webp', //生成的格式 webp 或 avif
        opt: { quality: 75,  effort: 4 }, //图片压缩参数
        isClear: true, //是否清理重新生成
        isReplacePath: true, //是否替换图片引用路径
        replaceList: ['.vue'], //需要替换图片引用路径文件的扩展名
      })
  ]
});
```

## 配置 【默认值】

```javascript
{
  entry: '', //入口
  imageType: ['.png', '.jpg'], //处理图片类型
  sharpType: 'webp', //生成的格式 webp 或 avif
  opt: { quality: 75,  effort: 4 }, //图片压缩参数
  outDir: '', //输出目录
  isClear: true, //是否清理重新生成
  isReplacePath: true, //是否替换图片引用路径
  replaceList: ['.vue'], //需要替换图片引用路径文件的扩展名
}
// opt 建议默认值  webp默认值{ quality: 75,  effort: 4 } avif默认值{ quality: 50,  effort: 4 }
// quality: 80 指定了 WebP 编码的质量，这个值可以在 0 到 100 之间设置，数值越高，图像质量越好，但文件大小也会随之增大。在这里，quality 被设置为 80，意味着编码后的图像质量比默认值更高。
// effort: 6 指定了 WebP 编码器的压缩程度。这个值可以在 0 到 6 之间设置，数值越高，压缩效果越好，但也会增加编码时间。在这里，effort 被设置为 6，意味着压缩效果比默认值更好，但也可能会增加编码时间。
```


