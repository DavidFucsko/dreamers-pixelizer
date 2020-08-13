import { IpcChannelInterface } from '../ipc/ipc-channel.interface';
import { IpcMainEvent } from 'electron';
import { IpcRequest } from '../ipc/ipc-request';
import { openFileDialog } from '../../common/handlers/file-open.handler';
import { FileOpenResponse } from '../../common/responses/file-open-response.interface';

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