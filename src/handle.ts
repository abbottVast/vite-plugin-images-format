
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
            if (['webp', 'avif'].includes(sharpType)) {
                //全局路径
                const nPath = helper.getWebpPath(abs, entry, outDir, sharpType);
                const nPathParse = path.parse(nPath);
                if (!fs.existsSync(nPathParse.dir)) {
                    fs.mkdirSync(nPathParse.dir, { recursive: true });
                }
                const samePath = helper.rtnSameStr(entry, outDir);
                filesMapList.push({
                    old: abs.replace(samePath, ''),
                    new: nPath.replace(samePath, '')
                });
                if (options.isClear) {
                    sharpImg(abs, nPath, sharpType, options);
                } else {
                    if (!fs.existsSync(nPath)) {
                        sharpImg(abs, nPath, sharpType, options);
                    }
                }
            } else {
                console.error('sharpType必须为webp或avif');
            }
        }
    });
}

function deleteFolder(filePath: string) {
    if (fs.existsSync(filePath)) {
        const files = fs.readdirSync(filePath);
        files.forEach((file) => {
            const nextFilePath = `${filePath}/${file}`;
            const states = fs.statSync(nextFilePath);
            if (states.isDirectory()) {
                //recurse
                deleteFolder(nextFilePath);
            } else {
                //delete file
                fs.unlinkSync(nextFilePath);
            }
        });
        fs.rmdirSync(filePath);
    }
}

export const handle = (options: any, filesMapList: Array<IFileMapItem>) => {
    const { entry, outDir, isClear } = options;
    if (isClear && fs.existsSync(outDir)) {
        deleteFolder(outDir);
    }
    const arr = helper.toArray(entry);
    for (let i = 0; i < arr.length; i++) {
        const dir: string = arr[i];
        createWebp(dir, options, filesMapList);
    }
};
