import { PixelizeImageRequestParams } from '../../electron/ipc/pixelize-image.request';
import { PixelizeImageResponse } from '../responses/pixelize-image-response.interface';

const palette = new Map<string, number>();
let dominantColors: string[] = [];
let orderedColors: string[] = [];

let dominantColorsRGB: { red: number, green: number, blue: number }[] = [];

export async function pixelizeImage(sourceImgParams: PixelizeImageRequestParams): Promise<PixelizeImageResponse> {

    const sourceData = sourceImgParams.pixelData;
    const pixelData = new Uint8ClampedArray(sourceData.length);

    const blockSize = sourceImgParams.blockSize;
    const propotionOfColors = sourceImgParams.propotionOfColor;

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
            createPalette(propotionOfColors, sourceImgParams.removeSimilarColors, sourceImgParams.removeColorPortion);
            iterateOverData(
                colorizePixels.bind(this, pixelData, pixelWidth, sourceData),
                numberOfDoubleLines,
                doubleLineCount,
                pixelWidth,
                blockSize
            );
            clearState();
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

function clearState() {
    palette.clear();
    dominantColors = [];
    orderedColors = [];
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

function createPalette(propotionOfColors: number, removeSimilarColors: boolean, removeColorPortion: number) {

    if (removeSimilarColors) {
        removeSimilarColorsFromPalette(palette, removeColorPortion);
    }

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

function removeSimilarColorsFromPalette(paletteToShirnk: Map<string, number>, removeColorPortion: number) {
    paletteToShirnk[Symbol.iterator] = function* () {
        yield* [...this.entries()]
            .sort((a, b) => rgbToHsl(b[0])[0] - rgbToHsl(a[0])[0]);
    }

    const sortedEntries = [];

    for (const [key, value] of palette) {
        sortedEntries.push(key);
    }

    for (let i = sortedEntries.length - 1; i > 0; i--) {
        if (!(colorDifferenceByColorString(sortedEntries[i], sortedEntries[i - 1]) > 441 * removeColorPortion)) {
            paletteToShirnk.delete(sortedEntries[i]);
        }
    }
}

function rgbToHsl(colorCode: string) {
    const r = parseInt(colorCode.toString().slice(0, 3), 10) / 255;
    const g = parseInt(colorCode.toString().slice(3, 6), 10) / 255;
    const b = parseInt(colorCode.toString().slice(6, 9), 10) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = (max + min) / 2;
    let s = h;
    const l = s;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return new Array(h * 360, s * 100, l * 100);
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

function colorDifferenceByColorString(firstColorString: string, secondColorString: string) {
    const firstColor = {
        red: parseInt(firstColorString.toString().slice(0, 3), 10),
        green: parseInt(firstColorString.toString().slice(3, 6), 10),
        blue: parseInt(firstColorString.toString().slice(6, 9), 10)
    }
    const secondColor = {
        red: parseInt(secondColorString.toString().slice(0, 3), 10),
        green: parseInt(secondColorString.toString().slice(3, 6), 10),
        blue: parseInt(secondColorString.toString().slice(6, 9), 10)
    }

    return colorDifference(
        firstColor.red,
        firstColor.green,
        firstColor.blue,
        secondColor.red,
        secondColor.green,
        secondColor.blue);
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