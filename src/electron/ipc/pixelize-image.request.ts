import { IpcRequest } from './ipc-request';

export interface PixelizeImageRequest extends IpcRequest {
    params: PixelizeImageRequestParams
}

export interface PixelizeImageRequestParams {
    pixelData: Uint8ClampedArray;
    width: number;
    height: number;
    blockSize: number;
    propotionOfColor: number;
    removeSimilarColors: boolean;
    removeColorPortion: number;
}

export interface PixelizeImageRequestInputParams {
    blockSize: string;
    propotionOfColor: string;
    removeSimilarColors: boolean;
    removeColorPortion: string;
}