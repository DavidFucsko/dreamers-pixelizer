import { IpcService } from '../../services/ipc.service';
import { RendererInterface } from '../../interfaces/renderer.interface';
import * as path from "path";

export class MainWindowRenderer implements RendererInterface {

    private static viewPath = '../templates/main.html';

    public render(): void {
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

    public getViewPath(): string {
        return path.join(__dirname, MainWindowRenderer.viewPath);
    }
}
