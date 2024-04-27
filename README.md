# vite-plugin-images-format 

vite插件: 把png,jpg图片转换成webp或avif格式,并替换文件引用路径

## 用法1
```json
// package.json 中添加开发环境依赖
  "devDependencies": {
    "vite-plugin-images-format": "git+ssh://git@github.com:abbottVast/vite-plugin-images-format.git#v1.0.0"
  }
```

## 用法2 【尚未发布npm】
```bash
npm install vite-plugin-images-format -D
```

```javascript
import imagesFormat from 'vite-plugin-images-format';

export default defineConfig({
  plugins: [
      imagesFormat({
          entry: resolve(__dirname, './src/public/images'),  //入口目录
          outDir: resolve(__dirname, 'src/public/images/artifact'),  //输入目录
      })
  ]
});
```

## 配置 【默认值】

```javascript
{
        entry: '', //入口
        imageType: ['.png', '.jpg'], // 处理图片类型
        sharpType: ['webp'], //生成的格式
        outDir: '', //输出目录
        isReplacePath: true, //是否替换图片引用路径
        replaceList: ['.vue'], //需要替换图片引用路径文件的扩展名
}
```


