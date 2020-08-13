import { IpcService } from '../../services/ipc.service';
import { RendererBaseClass } from '../../abstracts/classes/renderer.base';
import { Color } from '../parts/color.part';
import { ImageDrawer } from '../parts/image-drawer.part';
import { DreamersButton } from '../parts/button.part';
import { FileOpenResponse } from '../../../common/responses/file-open-response.interface';
import { PixelizeImageRequest } from '../../../electron/ipc/pixelize-image.request';
import { PixelizeImageResponse } from '../../../common/responses/pixelize-image-response.interface';
import { openFileByPath } from '../../../common/handlers/file-open.handler';

export class MainRenderer extends RendererBaseClass {

    public static viewPath = '../templates/main.html';
    public static dirName = __dirname;

    public render(): void {
        const ipc = new IpcService();

        Color.colorizeShell();
        const parentElement = document.createElement('div');
        const openButton = DreamersButton.createViewPart(parentElement, "Open Image");
        const pixelizeButton = DreamersButton.createViewPart(parentElement, "Pixelize Image");
        const sourceImageContainer = ImageDrawer.createViewPart(parentElement);
        const pixelizedImageContainer = ImageDrawer.createViewPart(parentElement);

        sourceImageContainer.subscribeForIpcEvent('dreamers:show-image');

        document.body.appendChild(parentElement);

        openButton.addEventListener('click', async () => {
            const response = await ipc.send<FileOpenResponse>('dreamers:open-file-dialog');
            sourceImageContainer.drawImage(response.file);
        });

        pixelizeButton.addEventListener('click', async () => {
            const sourceImgData = sourceImageContainer.getImgData();
            const response = await ipc.send<PixelizeImageResponse>(
                'dreamers:pixelize-image',
                {
                    params: {
                        pixelData: sourceImgData.data,
                        width: sourceImgData.width,
                        height: sourceImgData.height
                    }
                } as PixelizeImageRequest);
            pixelizedImageContainer.putImageData(response.pixelArtImage);
        });

        parentElement.ondragover = () => {
            return false;
        };

        parentElement.ondragleave = () => {
            return false;
        };

        parentElement.ondragend = () => {
            return false;
        };

        parentElement.ondrop = (event) => {
            openFileByPath(event.dataTransfer.files[0].path)
                .then(result => {
                    sourceImageContainer.drawImage(result.file);
                })
                .catch(error => error.message);
        };
    }
}