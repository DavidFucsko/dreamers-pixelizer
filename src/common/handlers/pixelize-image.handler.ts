import { PixelizeImageRequestParams } from '../../electron/ipc/pixelize-image.request';
import { PixelizeImageResponse } from '../responses/pixelize-image-response.interface';

const palette = new Map<string, number>();
let dominantColors: string[] = [];
const orderedColors: string[] = [];

let dominantColorsRGB: { red: number, green: number, blue: number }[] = [];

export async function pixelizeImage(sourceImgParams: PixelizeImageRequestParams): Promise<PixelizeImageResponse> {

    const sourceData = sourceImgParams.pixelData;
    const pixelData = new Uint8ClampedArray(sourceData.length);

    const blockSize = 20;
    const propotionOfColors = 0.5;

    const pixelWidth = sourceImgParams.width * 4;
    const doubleLineCount = (blockSize / 4) * pixelWidth;
    const numberOfDoubleLines = ((pixelWidth * sourceImgParams.height)) - doubleLineCount;

    return new Promise<PixelizeImageResponse>((resolve, reject) => {

        try {
            iterateOverData(
                extractDominantColors.bind(this, sourceData, pixelWidth),
                numberOfDoubleLines,
                doubleLineCount,
                pixelWidth,
                blockSize
            );
            createPalette(propotionOfColors);
            iterateOverData(
                colorizePixels.bind(this, pixelData, pixelWidth, sourceData),
                numberOfDoubleLines,
                doubleLineCount,
                pixelWidth,
                blockSize
            );
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

function iterateOverData(
    functionToRun: () => void,
    numberOfDoubleLines: number,
    doubleLineCount: number,
    pixelWidth: number,
    blockSize: number) {
    for (let i = 0;
        i <= numberOfDoubleLines;
        i += doubleLineCount) {
        for (let j = i; j <= i + pixelWidth; j += blockSize) {
            const newFunc = functionToRun.bind(null, blockSize, j);
            newFunc();
        }
    }
}

function colorizePixels(
    pixelData: Uint8ClampedArray,
    pixelWidth: number,
    sourceData: Uint8ClampedArray,
    blockSize?: number,
    index?: number) {

    const avgColors = getSuperPixelColorsFromIndex(index, sourceData, pixelWidth, blockSize);

    const color = findColorFromPalette(avgColors);

    for (let bs = 0; bs < blockSize / 4; bs++) {
        const lineOffset = index + pixelWidth * bs;
        for (let ps = 0; ps < blockSize; ps += 4) {
            const pixelOffset = lineOffset + ps;
            pixelData[pixelOffset] = color.red;
            pixelData[pixelOffset + 1] = color.green;
            pixelData[pixelOffset + 2] = color.blue;
            pixelData[pixelOffset + 3] = 255;
        }
    }
}

function extractDominantColors(
    sourceData: Uint8ClampedArray,
    pixelWidth: number,
    blockSize?: number,
    index?: number) {
    const avgColors = getSuperPixelColorsFromIndex(index, sourceData, pixelWidth, blockSize);

    const hashedColor =
        ("00" + avgColors.red.toString()).slice(-3) +
        ("00" + avgColors.green.toString()).slice(-3) +
        ("00" + avgColors.blue.toString()).slice(-3);

    const currentWeight = palette.get(hashedColor);
    if (currentWeight) {
        palette.set(hashedColor, currentWeight + 1);
    } else {
        palette.set(hashedColor, 1);
    }
}

function createPalette(propotionOfColors: number) {
    palette[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    }

    for (const [key, value] of palette) {
        orderedColors.push(key);
    }

    dominantColors = orderedColors.slice(0, orderedColors.length * propotionOfColors);
    dominantColorsRGB = dominantColors.map(colorCode => ({
        red: parseInt(colorCode.toString().slice(0, 3), 10),
        green: parseInt(colorCode.toString().slice(3, 6), 10),
        blue: parseInt(colorCode.toString().slice(6, 9), 10)
    }));

}

function findColorFromPalette(pixelColor: { red: number, green: number, blue: number }) {
    let closestColorHash = 0;
    let closestColor = { red: 0, green: 0, blue: 0 };
    dominantColorsRGB.forEach((color, index) => {
        const colorDiff = colorDifference(
            pixelColor.red,
            pixelColor.green,
            pixelColor.blue,
            color.red,
            color.green,
            color.blue
        );

        if (index === 0 || colorDiff < closestColorHash) {
            closestColorHash = colorDiff;
            closestColor = color;
        }
    });

    return closestColor;
}

function colorDifference(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
    let sumOfSquares = 0;

    sumOfSquares += Math.pow(r1 - r2, 2);
    sumOfSquares += Math.pow(g1 - g2, 2);
    sumOfSquares += Math.pow(b1 - b2, 2);

    return Math.sqrt(sumOfSquares);
}

function getSuperPixelColorsFromIndex(
    index: number,
    pixelData: Uint8ClampedArray,
    pixelWidth: number,
    blockSize: number) {

    const reds: number[] = [];
    const greens: number[] = [];
    const blues: number[] = [];

    for (let bs = 0; bs < blockSize / 4; bs++) {
        const lineOffset = index + pixelWidth * bs;
        for (let ps = 0; ps < blockSize; ps += 4) {
            const pixelOffset = lineOffset + ps;
            reds.push(pixelData[pixelOffset]);
            greens.push(pixelData[pixelOffset + 1]);
            blues.push(pixelData[pixelOffset + 2]);
        }
    }
    const avgRed = (reds.reduce((a, b) => a + b, 0) / blockSize) * (16 / blockSize);
    const avgBlue = (blues.reduce((a, b) => a + b, 0) / blockSize) * (16 / blockSize);
    const avgGreen = (greens.reduce((a, b) => a + b, 0) / blockSize) * (16 / blockSize);
    return {
        red: parseInt(avgRed.toString(), 10),
        green: parseInt(avgGreen.toString(), 10),
        blue: parseInt(avgBlue.toString(), 10)
    };
}