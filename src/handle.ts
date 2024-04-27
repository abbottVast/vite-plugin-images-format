
import fs from 'fs';
import path from 'path';
import helper from './helper';
import sharpImg from './sharpImg';

export interface IFileMapItem {
    old: string;
    new: string;
}

function createWebp(dir: string, options: any, filesMapList: Array<IFileMapItem>) {
    if (fs.existsSync(dir) === false) {
        return filesMapList;
    }
    const { imageType, entry, outDir, sharpType } = options;
    const files = fs.readdirSync(dir);
    files.forEach((v) => {
        const abs = path.join(dir, v);
        if (helper.isDirectory(abs)) {
            createWebp(abs, options, filesMapList);
        } else if (helper.isTargetImage(abs, imageType)) {
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
            } else {
                console.error('sharpType需为数组');
            }
        }
    });
}
export const handle = (options: any, filesMapList: Array<IFileMapItem>) => {
    const { entry } = options;
    const arr = helper.toArray(entry);
    for (let i = 0; i < arr.length; i++) {
        const dir: string = arr[i];
        createWebp(dir, options, filesMapList);
    }
};