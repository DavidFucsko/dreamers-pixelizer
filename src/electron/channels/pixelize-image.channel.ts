import { IpcChannelInterface } from '../ipc/ipc-channel.interface';
import { IpcRequest } from '../ipc/ipc-request';
import { PixelizeImageRequest } from '../ipc/pixelize-image.request';

export class PixelizeImageChannel implements IpcChannelInterface {
    getName(): string {
        return 'dreamers:pixelize-image';
    }
    handle(event: Electron.IpcMainEvent, request: PixelizeImageRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }

        event.sender.send(request.responseChannel, { pixelArtImage: request.params.sourceImage });
    }

}