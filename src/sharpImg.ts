import sharp from 'sharp';
const resizeReg = /\D+(\d+)[xX*](\d+)\.webp$/;

const sharpImg = (absPath: string, nPath: string, type: string): Promise<any> => {
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
                        } else {
                            resolve(info);
                        }
                    });
            } catch (e) {
                reject(e);
            }
        } else {
            try {
                sharp(absPath)
                    .resize({ width, height })
                    .webp()
                    .toFile(nPath, (err, info) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(info);
                        }
                    });
            } catch (e) {
                reject(e);
            }
        }
    });
};
export default sharpImg;
