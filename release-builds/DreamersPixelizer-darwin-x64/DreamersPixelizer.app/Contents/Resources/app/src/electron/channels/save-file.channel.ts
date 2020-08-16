import { IpcMainEvent } from 'electron';
import { IpcChannelInterface } from '../ipc/ipc-channel.interface';
import { IpcRequest } from '../ipc/ipc-request';
import { saveFileDialog } from '../../common';

export class SaveFileChannel implements IpcChannelInterface {

    getName() {
        return 'dreamers:save-file-dialog';
    }

    handle(event: IpcMainEvent, request: IpcRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }

        saveFileDialog().then((response: { filePath: string }) => {
            event.sender.send(request.responseChannel, response);
        }).catch(error => error.message);
    }
}