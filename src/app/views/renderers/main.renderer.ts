import { IpcService } from '../../services/ipc.service';
import { RendererBaseClass } from '../../abstracts/classes/renderer.base';
import { DefaulColors } from '../parts/default-colors.part';
import { ImageDrawer } from '../parts/image-drawer.part';
import { DreamersButton } from '../parts/button.part';

export class MainRenderer extends RendererBaseClass {

    public static viewPath = '../templates/main.html';
    public static dirName = __dirname;

    public render(): void {
        const ipc = new IpcService();

        DefaulColors.colorizeShell();
        const parentElement = document.createElement('div');
        const button = DreamersButton.createViewPart(parentElement, "Open Image");
        const imageContainer = ImageDrawer.createViewPart(parentElement);

        button.addEventListener('click', async () => {
            const response = await ipc.send<{ file: string }>('dreamers:open-file');
            ImageDrawer.setImgSrc(imageContainer, response.file);
            // tslint:disable-next-line: no-console
            console.log(imageContainer.src);

        });

        document.body.appendChild(parentElement);
    }
}