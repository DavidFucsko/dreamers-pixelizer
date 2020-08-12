import { IpcService } from '../../services/ipc.service';
import { RendererBaseClass } from '../../abstracts/classes/renderer.base';
import { Color } from '../parts/color.part';
import { ImageDrawer } from '../parts/image-drawer.part';
import { DreamersButton } from '../parts/button.part';
import { FileOpenResponse } from '../../../common/interfaces/file-open-response.interface';
import { PixelizeImageRequest } from '../../../electron/ipc/pixelize-image.request';

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

        openButton.addEventListener('click', async () => {
            const response = await ipc.send<FileOpenResponse>('dreamers:open-file');
            ImageDrawer.setImgSrc(sourceImageContainer, response.file);
            // tslint:disable-next-line: no-console
            console.log(sourceImageContainer.src);

        });

        pixelizeButton.addEventListener('click', async () => {
            const response = await ipc.send<{ pixelArtImage: string }>(
                'dreamers:pixelize-image',
                { params: { sourceImage: ImageDrawer.getSourceImg(sourceImageContainer) } } as PixelizeImageRequest);
            ImageDrawer.setImgSrc(pixelizedImageContainer, response.pixelArtImage);
        });

        document.body.appendChild(parentElement);
    }
}