import { PixelizeImageRequestParams } from '../../electron/ipc/pixelize-image.request';
import { PixelizeImageResponse } from '../responses/pixelize-image-response.interface';

export async function pixelizeImage(sourceImgParams: PixelizeImageRequestParams): Promise<PixelizeImageResponse> {

    const sourceData = sourceImgParams.pixelData;
    const pixelData = new Uint8ClampedArray(sourceData.length);

    console.log(sourceData.length, sourceImgParams.width, sourceImgParams.height);

    return new Promise<PixelizeImageResponse>((resolve, reject) => {
        try {
            for (let i = 0, n = sourceData.length; i < n; i += 4) {
                pixelData[i] = 255 - sourceData[i]; // red
                pixelData[i + 1] = 255 - sourceData[i + 1]; // green
                pixelData[i + 2] = 255 - sourceData[i + 2]; // blue
                pixelData[i + 3] = 255;
                // i+3 is alpha (the fourth element)
            }
            resolve({
                pixelArtImage: {
                    pixels: pixelData,
                    width: sourceImgParams.width,
                    height: sourceImgParams.height
                }
            });
        } catch (error) {
            reject(new Error(error));
        }
    });
}