import { IpcChannelInterface } from '../ipc/ipc-channel.interface';
import { PixelizeImageRequest } from '../ipc/pixelize-image.request';

import { pixelizeImage } from '../../common/handlers/pixelize-image.handler';

export class PixelizeImageChannel implements IpcChannelInterface {
    getName(): string {
        return 'dreamers:pixelize-image';
    }
    handle(event: Electron.IpcMainEvent, request: PixelizeImageRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }

        console.log(request.params.pixelData);
        pixelizeImage(request.params).then(response =>
            event.sender.send(request.responseChannel, response));
    }

}