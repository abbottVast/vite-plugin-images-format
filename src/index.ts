import { IFileMapItem, handle } from './handle';
import helper from './helper';
import { name  } from '../package.json';
interface IOptions {
    entry: string;
    imageType: Array<string>;
    sharpType: 'webp' | 'avif';
    opt: {
        quality: number;
        effort: number;
    };
    outDir: string;
    isClear: boolean;
    replaceList: Array<string>;
    isReplacePath: boolean;
}

export default function main(options: IOptions | unknown = {}) {
    const customOpts: IOptions = {
        entry: '', //入口
        imageType: ['.png', '.jpg'], //处理图片类型
        sharpType: 'webp', //生成的格式 webp 或 avif
        opt: { quality: 75,  effort: 4 }, //图片压缩参数
        outDir: '', //输出目录
        isClear: true, //是否清理重新生成
        isReplacePath: true, //是否替换图片引用路径
        replaceList: ['.vue'], //需要替换图片引用路径文件的扩展名
    };
    const opts: IOptions = Object.assign(customOpts, options);
    let filesMapList: Array<IFileMapItem> = [];

    handle(opts, filesMapList);
    const samePath = helper.rtnSameStr(opts.entry,opts.outDir);
    filesMapList = filesMapList.map(item=>{
        return {
            old: item.old.replace(samePath, ''),
            new: item.new.replace(samePath, '')
        };
    });
    return {
        name,
        enforce: 'pre',
        transform(code, _id) {
            let _code = code;
            if (opts.isReplacePath) {
                opts.replaceList.forEach(ext => {
                    if (_id.endsWith(ext)) {
                        filesMapList.forEach(item=>{
                            _code = _code.replaceAll(item.old, item.new);
                        });
                    }
                });
            }
            return _code;
        }
    };
}
