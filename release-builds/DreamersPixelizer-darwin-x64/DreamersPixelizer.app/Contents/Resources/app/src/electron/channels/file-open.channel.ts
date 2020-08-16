import { IpcChannelInterface } from '../ipc/ipc-channel.interface';
import { IpcMainEvent } from 'electron';
import { IpcRequest } from '../ipc/ipc-request';
import { openFileDialog, FileOpenResponse } from '../../common';

export class FileOpenChannel implements IpcChannelInterface {

    getName() {
        return 'dreamers:open-file-dialog';
    }

    handle(event: IpcMainEvent, request: IpcRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }
        openFileDialog()
            .then((response: FileOpenResponse) => {
                event.sender.send(request.responseChannel, { file: response.file });
            })
            .catch(error => error.message);
    }
}