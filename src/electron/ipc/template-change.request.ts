import { IpcRequest } from './ipc-request';

export interface TemplateChangeRequest extends IpcRequest {
    params: string[];
}