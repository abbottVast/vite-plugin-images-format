import fs from 'fs';
function toArray(data: string | string[]): string[] {
    if (typeof data === 'string') {
        return data ? [data] : [];
    }
    return data;
}

function isDirectory(path: string): boolean {
    return fs.statSync(path).isDirectory();
}

function evalCatch(data: any): any {
    try {
        // @ts-ignore
        return window.eval(data);
    } catch (_) {
        return data;
    }
}

function isTargetImage(id: string, imageType: string[]): boolean {
    const arr = evalCatch(id).split('.');
    const suffix = arr[arr.length - 1];
    return imageType.includes(`.${suffix}`);
}

function getWebpPath(id: string, entry, outDir, type): string {
    const arr = id.split('.');
    const suffix = arr[arr.length - 1];
    const reg = new RegExp(`${suffix}$`);
    // const reg2 = new RegExp(`${entry}`, 'g');
    return id.replace(reg, type).replace(entry, outDir);
}

function rtnSameStr(str1: string, str2: string): string {
    var l = str1.length > str2.length ? str2.length : str1.length, //取短的
        i = 0
    while(i < l){
        if(str1[i] !== str2[i])break
        i++
    }
    return str1.substr(0,i);
}

export default {
    toArray,
    isDirectory,
    evalCatch,
    isTargetImage,
    getWebpPath,
    rtnSameStr,
};
