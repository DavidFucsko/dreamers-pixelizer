import { IpcService } from '../../services/ipc.service';
import { RendererBaseClass } from '../../abstracts/classes/renderer.base';
import { DefaulColors } from '../parts/default-colors.part';
import { ImageDrawer } from '../parts/image-drawer.part';

export class MainRenderer extends RendererBaseClass {

    public static viewPath = '../templates/main.html';
    public static dirName = __dirname;

    public render(): void {
        DefaulColors.colorizeShell();
        const ipc = new IpcService();

        const parentElement = document.createElement('div');
        const button = document.createElement('button');
        const imageContainer = new ImageDrawer(parentElement);

        button.innerHTML = "Open image";
        button.id = "open-image";
        button.addEventListener('click', async () => {
            const response = await ipc.send<{ file: string }>('dreamers:open-file');

            imageContainer.setImageSrc(response.file);

            // tslint:disable-next-line: no-console
            console.log(imageContainer.getImageSrc());

        });
        parentElement.appendChild(button);

        document.body.appendChild(parentElement);
    }
}