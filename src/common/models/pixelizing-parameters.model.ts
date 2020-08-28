export interface PixelizingParameters {
    sourceData: Uint8ClampedArray,
    pixelizedData: Uint8ClampedArray,
    blockSize: number,
    propotionOfColors: number,
    pixelWidth: number,
    blockWidth: number,
    numberOfBlocks: number
}