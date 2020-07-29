import { IpcChannelInterface } from './ipc-channel.interface';
import { IpcMainEvent, remote, dialog } from 'electron';
import { IpcRequest } from './ipc-request';
import * as fs from 'fs';

export class FileOpenChannel implements IpcChannelInterface {
    getName() {
        return 'dreamers:open-file';
    }

    handle(event: IpcMainEvent, request: IpcRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }

        const fileSelect = dialog.showOpenDialog({
            filters: [{ name: 'Images', extensions: ['png', 'jpg'] }]
        });

        fileSelect.then(({ canceled, filePaths, bookmarks }) => {
            const base64 = fs.readFileSync(filePaths[0]).toString('base64');

            event.sender.send(request.responseChannel, { file: base64 })
        });

    }
}