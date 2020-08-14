import { PixelizeImageRequestParams } from '../../electron/ipc/pixelize-image.request';
import { PixelizeImageResponse } from '../responses/pixelize-image-response.interface';

const palette = new Map<string, number>();
let dominantColors: string[] = [];
let orderedColors: string[] = [];

export async function pixelizeImage(sourceImgParams: PixelizeImageRequestParams): Promise<PixelizeImageResponse> {

    const sourceData = sourceImgParams.pixelData;
    const pixelData = new Uint8ClampedArray(sourceData.length);

    console.log(sourceData.length, sourceImgParams.width, sourceImgParams.height);

    const pixelWidth = sourceImgParams.width * 4;
    const numberOfDoubleLines = ((pixelWidth * sourceImgParams.height)) - (2 * pixelWidth);
    const doubleLineCount = 2 * pixelWidth;

    return new Promise<PixelizeImageResponse>((resolve, reject) => {

        try {
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
            iterateOverData(
                extractDominantColors.bind(this, sourceData, pixelWidth),
                numberOfDoubleLines,
                doubleLineCount,
                pixelWidth
            );
            createPalette();
            iterateOverData(
                colorizePixels.bind(this, pixelData, pixelWidth, sourceData),
                numberOfDoubleLines,
                doubleLineCount,
                pixelWidth
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

function isColorLight(r: number, g: number, b: number) {
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    const hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {
        return true;
    }
    return false;
}

function iterateOverData(
    functionToRun: () => void,
    numberOfDoubleLines: number,
    doubleLineCount: number,
    pixelWidth: number) {
    for (let i = 0;
        i <= numberOfDoubleLines;
        i += doubleLineCount) {
        for (let j = i; j <= i + pixelWidth; j += 8) {
            const newFunc = functionToRun.bind(null, j);
            newFunc();
        }
    }
}

function colorizePixels(
    pixelData: Uint8ClampedArray,
    pixelWidth: number,
    sourceData: Uint8ClampedArray,
    index?: number) {

    const lineOffset = index + pixelWidth;
    const avgColors = getSuperPixelColorsFromIndex(index, sourceData, lineOffset);

    const color = findColorFromPalette(avgColors);

    // first pixel
    pixelData[index] = color.red;
    pixelData[index + 1] = color.green;
    pixelData[index + 2] = color.blue;
    pixelData[index + 3] = 255;

    // second pixel
    pixelData[index + 4] = color.red;
    pixelData[index + 5] = color.green;
    pixelData[index + 6] = color.blue;
    pixelData[index + 7] = 255;

    // third pixel
    pixelData[lineOffset] = color.red;
    pixelData[lineOffset + 1] = color.green;
    pixelData[lineOffset + 2] = color.blue;
    pixelData[lineOffset + 3] = 255;

    // fourth pixel
    pixelData[lineOffset + 4] = color.red;
    pixelData[lineOffset + 5] = color.green;
    pixelData[lineOffset + 6] = color.blue;
    pixelData[lineOffset + 7] = 255;
}

function extractDominantColors(
    sourceData: Uint8ClampedArray,
    pixelWidth: number,
    index?: number) {
    const lineOffset = index + pixelWidth;
    const avgColors = getSuperPixelColorsFromIndex(index, sourceData, lineOffset);

    const hashedColor = ("00" + avgColors.red.toString()).slice(-3) + ("00" + avgColors.green.toString()).slice(-3) + ("00" + avgColors.blue.toString()).slice(-3);
    const currentWeight = palette.get(hashedColor);
    if (currentWeight) {
        palette.set(hashedColor, currentWeight + 1);
    } else {
        palette.set(hashedColor, 1);
    }
}

function createPalette() {
    palette[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
    }

    for (let [key, value] of palette) {
        orderedColors.push(key);
    }

    dominantColors = orderedColors.slice(0, orderedColors.length < 1000 ? orderedColors.length : 1000);
}

function findColorFromPalette(pixelColor: { red: number, green: number, blue: number }) {
    let closestColorHash = 0;
    let closestColor = { red: 0, green: 0, blue: 0 };
    dominantColors.map(colorCode => ({
        red: parseInt(colorCode.toString().slice(0, 3), 10),
        green: parseInt(colorCode.toString().slice(3, 6), 10),
        blue: parseInt(colorCode.toString().slice(6, 9), 10)
    })).forEach((color, index) => {
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
        red: parseInt(avgRed.toString(), 10),
        green: parseInt(avgGreen.toString(), 10),
        blue: parseInt(avgBlue.toString(), 10)
    };
}