/*!
 * vite-plugin-images-format v1.0.0
 * (c) Sat Apr 27 2024 17:14:43 GMT+0800 (中国标准时间) lbr
 * Released under the MIT License.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

function toArray(data) {
    if (typeof data === 'string') {
        return data ? [data] : [];
    }
    return data;
}
function isDirectory(path) {
    return fs.statSync(path).isDirectory();
}
function evalCatch(data) {
    try {
        // @ts-ignore
        return window.eval(data);
    }
    catch (_) {
        return data;
    }
}
function isTargetImage(id, imageType) {
    const arr = evalCatch(id).split('.');
    const suffix = arr[arr.length - 1];
    return imageType.includes(`.${suffix}`);
}
function getWebpPath(id, entry, outDir, type) {
    const arr = id.split('.');
    const suffix = arr[arr.length - 1];
    const reg = new RegExp(`${suffix}$`);
    // const reg2 = new RegExp(`${entry}`, 'g');
    return id.replace(reg, type).replace(entry, outDir);
}
function rtnSameStr(str1, str2) {
    var l = str1.length > str2.length ? str2.length : str1.length, //取短的
    i = 0;
    while (i < l) {
        if (str1[i] !== str2[i])
            break;
        i++;
    }
    return str1.substr(0, i);
}
var helper = {
    toArray,
    isDirectory,
    evalCatch,
    isTargetImage,
    getWebpPath,
    rtnSameStr,
};

const resizeReg = /\D+(\d+)[xX*](\d+)\.webp$/;
const sharpImg = (absPath, nPath, type) => {
    let width = null;
    let height = null;
    resizeReg.lastIndex = 0;
    if (resizeReg.test(nPath)) {
        width = Number(RegExp.$1);
        height = Number(RegExp.$2);
    }
    return new Promise((resolve, reject) => {
        if (type === 'avif') {
            try {
                sharp(absPath)
                    .resize({ width, height })
                    .avif()
                    .toFile(nPath, (err, info) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(info);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        }
        else {
            try {
                sharp(absPath)
                    .resize({ width, height })
                    .webp()
                    .toFile(nPath, (err, info) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(info);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        }
    });
};

function createWebp(dir, options, filesMapList) {
    if (fs.existsSync(dir) === false) {
        return filesMapList;
    }
    const { imageType, entry, outDir, sharpType } = options;
    const files = fs.readdirSync(dir);
    files.forEach((v) => {
        const abs = path.join(dir, v);
        if (helper.isDirectory(abs)) {
            createWebp(abs, options, filesMapList);
        }
        else if (helper.isTargetImage(abs, imageType)) {
            if (Array.isArray(sharpType)) {
                sharpType.forEach((type) => {
                    //全局路径
                    const nPath = helper.getWebpPath(abs, entry, outDir, type);
                    const nPathParse = path.parse(nPath);
                    if (fs.existsSync(nPathParse.dir)) {
                        fs.mkdirSync(nPathParse.dir);
                    }
                    const samePath = helper.rtnSameStr(entry, outDir);
                    filesMapList.push({
                        old: abs.replace(samePath, ''),
                        new: nPath.replace(samePath, '')
                    });
                    sharpImg(abs, nPath, type);
                });
            }
            else {
                console.error('sharpType需为数组');
            }
        }
    });
}
const handle = (options, filesMapList) => {
    const { entry } = options;
    const arr = helper.toArray(entry);
    for (let i = 0; i < arr.length; i++) {
        const dir = arr[i];
        createWebp(dir, options, filesMapList);
    }
};

var name = "vite-plugin-images-format";

function main(options = {}) {
    const customOpts = {
        entry: '',
        imageType: ['.png', '.jpg'],
        sharpType: ['webp'],
        outDir: '',
        isReplacePath: true,
        replaceList: ['.vue'], //需要替换图片引用路径文件的扩展名
    };
    const opts = Object.assign(customOpts, options);
    let filesMapList = [];
    handle(opts, filesMapList);
    const samePath = helper.rtnSameStr(opts.entry, opts.outDir);
    filesMapList = filesMapList.map(item => {
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
                        filesMapList.forEach(item => {
                            _code = _code.replaceAll(item.old, item.new);
                        });
                    }
                });
            }
            return _code;
        }
    };
}

export { main as default };
