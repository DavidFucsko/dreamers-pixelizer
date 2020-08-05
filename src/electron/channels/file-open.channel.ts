import { IpcChannelInterface } from '../ipc/ipc-channel.interface';
import { IpcMainEvent } from 'electron';
import { IpcRequest } from '../ipc/ipc-request';
import { openFileDialog } from '../../common/file-open.handler';

export class FileOpenChannel implements IpcChannelInterface {
    getName() {
        return 'dreamers:open-file';
    }

    handle(event: IpcMainEvent, request: IpcRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }
        openFileDialog().then(response => {
            event.sender.send(request.responseChannel, { file: response.file });
        });
    }
}