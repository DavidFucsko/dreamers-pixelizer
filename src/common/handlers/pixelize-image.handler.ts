import { PixelizeImageRequestParams } from '../../electron/ipc/pixelize-image.request';
import { PixelizeImageResponse } from '../responses/pixelize-image-response.interface';

export async function pixelizeImage(sourceImgParams: PixelizeImageRequestParams): Promise<PixelizeImageResponse> {

    const sourceData = sourceImgParams.pixelData;
    const pixelData = new Uint8ClampedArray(sourceData.length);

    console.log(sourceData.length, sourceImgParams.width, sourceImgParams.height);

    return new Promise<PixelizeImageResponse>((resolve, reject) => {
        const pixelWidth = sourceImgParams.width * 4;
        const numberOfDoubleLines = ((pixelWidth * sourceImgParams.height)) - (2 * pixelWidth);
        const doubleLineCount = 2 * pixelWidth;

        try {
            for (let i = 0;
                i <= numberOfDoubleLines;
                i += doubleLineCount) {
                for (let j = i; j <= i + pixelWidth; j += 8) {
                    const lineOffset = j + pixelWidth;
                    const avgColors = getSuperPixelColorsFromIndex(j, sourceData, lineOffset);

                    // first pixel
                    pixelData[j] = avgColors.avgRed;
                    pixelData[j + 1] = avgColors.avgGreen;
                    pixelData[j + 2] = avgColors.avgBlue;
                    pixelData[j + 3] = 255;

                    // second pixel
                    pixelData[j + 4] = avgColors.avgRed;
                    pixelData[j + 5] = avgColors.avgGreen;
                    pixelData[j + 6] = avgColors.avgBlue;
                    pixelData[j + 7] = 255;

                    // third pixel
                    pixelData[lineOffset] = avgColors.avgRed;
                    pixelData[lineOffset + 1] = avgColors.avgGreen;
                    pixelData[lineOffset + 2] = avgColors.avgBlue;
                    pixelData[lineOffset + 3] = 255;

                    // fourth pixel
                    pixelData[lineOffset + 4] = avgColors.avgRed;
                    pixelData[lineOffset + 5] = avgColors.avgGreen;
                    pixelData[lineOffset + 6] = avgColors.avgBlue;
                    pixelData[lineOffset + 7] = 255;
                }
            }
            // for (let i = 0, n = sourceData.length; i < n; i += 8) {
            //     pixelData[i] = 255 - sourceData[i]; // red
            //     pixelData[i + 1] = 255 - sourceData[i + 1]; // green
            //     pixelData[i + 2] = 255 - sourceData[i + 2]; // blue
            //     pixelData[i + 3] = 255;
            //     pixelData[i+4] = 255;
            //     pixelData[i+5] = 255;
            //     pixelData[i+6] = 255;
            //     pixelData[i+7] = 255;
            //     // i+3 is alpha (the fourth element)
            // }
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

function getSuperPixelColorsFromIndex(j: number, pixelData: Uint8ClampedArray, lineOffset: number) {
    const firstPixel = {
        red: pixelData[j],
        green: pixelData[j + 1],
        blue: pixelData[j + 2]
    };
    const secondPixel = {
        red: pixelData[j + 4],
        green: pixelData[j + 5],
        blue: pixelData[j + 6]
    };
    const thirdPixel = {
        red: pixelData[lineOffset],
        green: pixelData[lineOffset + 1],
        blue: pixelData[lineOffset + 2]
    };
    const fourthPixel = {
        red: pixelData[lineOffset + 4],
        green: pixelData[lineOffset + 5],
        blue: pixelData[lineOffset + 6]
    };

    const avgRed = [
        firstPixel.red,
        secondPixel.red, thirdPixel.red,
        fourthPixel.red
    ].reduce((a, b) => a + b, 0) / 4;

    const avgGreen = [
        firstPixel.green,
        secondPixel.green,
        thirdPixel.green,
        fourthPixel.green].reduce((a, b) => a + b, 0) / 4;

    const avgBlue = [
        firstPixel.blue,
        secondPixel.blue,
        thirdPixel.blue,
        fourthPixel.blue].reduce((a, b) => a + b, 0) / 4;

    return {
        avgRed: parseInt(avgRed.toString(), 10),
        avgGreen: parseInt(avgGreen.toString(), 10),
        avgBlue: parseInt(avgBlue.toString(), 10)
    };
}