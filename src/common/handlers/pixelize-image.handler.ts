import { PixelizeImageRequestParams } from '../../electron';
import { PixelizeImageResponse } from '../responses/pixelize-image-response.interface';
import { PixelizingParameters, ColorObject } from '../models';

const palette = new Map<string, number>();
let dominantColors: string[] = [];
let orderedColors: string[] = [];

let dominantColorsRGB: { red: number, green: number, blue: number }[] = [];

const pixelizingParameters: PixelizingParameters = {} as PixelizingParameters;

export async function pixelizeImage(sourceImgParams: PixelizeImageRequestParams): Promise<PixelizeImageResponse> {
    pixelizingParameters.sourceData = new Uint8ClampedArray(sourceImgParams.pixelData.length);
    pixelizingParameters.sourceData = sourceImgParams.pixelData;
    pixelizingParameters.pixelizedData = new Uint8ClampedArray(pixelizingParameters.sourceData.length);

    pixelizingParameters.blockSize = sourceImgParams.blockSize;
    pixelizingParameters.propotionOfColors = sourceImgParams.propotionOfColor;

    pixelizingParameters.pixelWidth = sourceImgParams.width * 4;
    pixelizingParameters.blockWidth = (pixelizingParameters.blockSize / 4) * pixelizingParameters.pixelWidth;
    pixelizingParameters.numberOfBlocks =
        ((pixelizingParameters.pixelWidth * sourceImgParams.height)) - pixelizingParameters.blockWidth;

    return new Promise<PixelizeImageResponse>((resolve, reject) => {

        try {
            iterateOverData(
                extractDominantColors.bind(this)
            );
            createPalette(sourceImgParams.removeSimilarColors, sourceImgParams.removeColorPortion);
            iterateOverData(
                colorizePixels.bind(this)
            );
            clearState();
            resolve({
                pixelArtImage: {
                    pixels: pixelizingParameters.pixelizedData,
                    width: sourceImgParams.width,
                    height: sourceImgParams.height
                }
            });
        } catch (error) {
            reject(new Error(error));
        }
    });
}

function iterateOverData(functionToRun: () => void): void {
    for (let i = 0;
        i <= pixelizingParameters.numberOfBlocks;
        i += pixelizingParameters.blockWidth) {
        for (let j = i; j <= i + pixelizingParameters.pixelWidth; j += pixelizingParameters.blockSize) {
            const newFunc = functionToRun.bind(null, j);
            newFunc();
        }
    }
}

function extractDominantColors(index?: number): void {
    const avgColors = getSuperPixelColorsFromIndex(index);

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

function createPalette(removeSimilarColors: boolean, removeColorPortion: number): void {
    if (removeSimilarColors) {
        removeSimilarColorsFromPalette(palette, removeColorPortion);
    }

    palette[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    }

    for (const [key, value] of palette) {
        orderedColors.push(key);
    }

    dominantColors = orderedColors.slice(0, orderedColors.length * pixelizingParameters.propotionOfColors);
    dominantColorsRGB = dominantColors.map(colorCode => (colorObjectFromColorCode(colorCode)));

}

function colorizePixels(index?: number): void {
    const avgColors = getSuperPixelColorsFromIndex(index);
    const color = findColorFromPalette(avgColors);

    for (let bs = 0; bs < pixelizingParameters.blockSize / 4; bs++) {
        const lineOffset = index + pixelizingParameters.pixelWidth * bs;
        for (let ps = 0; ps < pixelizingParameters.blockSize; ps += 4) {
            const pixelOffset = lineOffset + ps;
            pixelizingParameters.pixelizedData[pixelOffset] = color.red;
            pixelizingParameters.pixelizedData[pixelOffset + 1] = color.green;
            pixelizingParameters.pixelizedData[pixelOffset + 2] = color.blue;
            pixelizingParameters.pixelizedData[pixelOffset + 3] = 255;
        }
    }
}

function clearState(): void {
    palette.clear();
    dominantColors = [];
    orderedColors = [];
}

function getSuperPixelColorsFromIndex(index: number): ColorObject {
    const reds: number[] = [];
    const greens: number[] = [];
    const blues: number[] = [];

    for (let bs = 0; bs < pixelizingParameters.blockSize / 4; bs++) {
        const lineOffset = index + pixelizingParameters.pixelWidth * bs;
        for (let ps = 0; ps < pixelizingParameters.blockSize; ps += 4) {
            const pixelOffset = lineOffset + ps;
            reds.push(pixelizingParameters.sourceData[pixelOffset]);
            greens.push(pixelizingParameters.sourceData[pixelOffset + 1]);
            blues.push(pixelizingParameters.sourceData[pixelOffset + 2]);
        }
    }
    const avgRed = calculateAvgColor(reds);
    const avgBlue = calculateAvgColor(blues);
    const avgGreen = calculateAvgColor(greens);
    return {
        red: parseInt(avgRed.toString(), 10),
        green: parseInt(avgGreen.toString(), 10),
        blue: parseInt(avgBlue.toString(), 10)
    };
}

function calculateAvgColor(colors: number[]): number {
    return (colors.reduce((a, b) => a + b, 0) / pixelizingParameters.blockSize) * (16 / pixelizingParameters.blockSize);
}

function findColorFromPalette(pixelColor: ColorObject): ColorObject {
    let closestColorHash = 0;
    let closestColor = { red: 0, green: 0, blue: 0 };
    dominantColorsRGB.forEach((color, index) => {
        const colorDiff = colorDifference(pixelColor, color);

        if (index === 0 || colorDiff < closestColorHash) {
            closestColorHash = colorDiff;
            closestColor = color;
        }
    });

    return closestColor;
}

function colorDifferenceByColorString(firstColorCode: string, secondColorCode: string): number {
    const firstColor = colorObjectFromColorCode(firstColorCode);
    const secondColor = colorObjectFromColorCode(secondColorCode);

    return colorDifference(firstColor, secondColor);
}

function colorDifference(firstColor: ColorObject, secondColor: ColorObject): number {
    let sumOfSquares = 0;

    sumOfSquares += Math.pow(firstColor.red - secondColor.red, 2);
    sumOfSquares += Math.pow(firstColor.green - secondColor.green, 2);
    sumOfSquares += Math.pow(firstColor.blue - secondColor.blue, 2);

    return Math.sqrt(sumOfSquares);
}

function removeSimilarColorsFromPalette(paletteToShirnk: Map<string, number>, removeColorPortion: number): void {
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

function rgbToHsl(colorCode: string): number[] {
    const color = colorObjectFromColorCode(colorCode);
    const r = color.red / 255;
    const g = color.green / 255;
    const b = color.blue / 255;

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

function colorObjectFromColorCode(colorCode: string): ColorObject {
    return {
        red: parseInt(colorCode.toString().slice(0, 3), 10),
        green: parseInt(colorCode.toString().slice(3, 6), 10),
        blue: parseInt(colorCode.toString().slice(6, 9), 10)
    }
}
