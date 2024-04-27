declare function toArray(data: string | string[]): string[];
declare function isDirectory(path: string): boolean;
declare function evalCatch(data: any): any;
declare function isTargetImage(id: string, imageType: string[]): boolean;
declare function getWebpPath(id: string, entry: any, outDir: any, type: any): string;
declare function rtnSameStr(str1: string, str2: string): string;
declare const _default: {
    toArray: typeof toArray;
    isDirectory: typeof isDirectory;
    evalCatch: typeof evalCatch;
    isTargetImage: typeof isTargetImage;
    getWebpPath: typeof getWebpPath;
    rtnSameStr: typeof rtnSameStr;
};
export default _default;
