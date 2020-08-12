import { IpcRequest } from './ipc-request';

export interface PixelizeImageRequest extends IpcRequest {
    params: { sourceImage: string }
}