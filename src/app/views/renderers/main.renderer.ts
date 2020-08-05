import { IpcService } from '../../services/ipc.service';
import { RendererBaseClass } from '../../abstracts/classes/renderer.base';
import { DefaulColors } from '../parts/default-colors.part';

export class MainRenderer extends RendererBaseClass {

    public static viewPath = '../templates/main.html';
    public static dirName = __dirname;

    public render(): void {
        DefaulColors.colorizeShell();
        const ipc = new IpcService();

        const parentElement = document.createElement('div');
        const button = document.createElement('button');
        const imageContainer = document.createElement('img');

        button.innerHTML = "Open image";
        button.id = "open-image";
        button.addEventListener('click', async () => {
            const response = await ipc.send<{ file: string }>('dreamers:open-file');

            imageContainer.src = "data:image/png;base64," + response.file;

            // tslint:disable-next-line: no-console
            console.log(imageContainer.src);

        });
        parentElement.appendChild(button);
        parentElement.appendChild(imageContainer);

        document.body.appendChild(parentElement);
    }
}