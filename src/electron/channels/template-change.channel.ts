import { IpcChannelInterface } from '../ipc/ipc-channel.interface';
import { IpcMainEvent } from 'electron';
import { IpcRequest } from '../ipc/ipc-request';

export class TemplateChangeChannel implements IpcChannelInterface {

    getName() {
        return 'dreamers:change-template';
    }

    handle(event: IpcMainEvent, request: IpcRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }

        event.sender.loadFile(request.params[0]);
    }
}