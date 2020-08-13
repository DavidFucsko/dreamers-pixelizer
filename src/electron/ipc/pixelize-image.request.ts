import { IpcRequest } from './ipc-request';

export interface PixelizeImageRequest extends IpcRequest {
    params: PixelizeImageRequestParams
}

export interface PixelizeImageRequestParams {
    pixelData: Uint8ClampedArray;
    width: number;
    height: number;
}