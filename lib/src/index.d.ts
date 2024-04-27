interface IOptions {
    entry: string;
    imageType: Array<string>;
    sharpType: Array<string>;
    outDir: string;
    replaceList: Array<string>;
    isReplacePath: boolean;
}
export default function main(options?: IOptions | unknown): {
    name: string;
    enforce: string;
    transform(code: any, _id: any): any;
};
export {};
