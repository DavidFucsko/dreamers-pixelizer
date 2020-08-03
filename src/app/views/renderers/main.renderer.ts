import { IpcService } from '../../services/ipc.service';
import { RendererBaseClass } from '../../abstracts/classes/renderer.base';
import * as path from "path";
import { TestRenderer } from './test.renderer';

export class MainRenderer implements RendererBaseClass {

    private static viewPath = '../templates/main.html';

    public render(): void {
        const ipc = new IpcService();

        const parentElement = document.createElement('div');
        const button = document.createElement('button');
        const imageContainer = document.createElement('img');

        button.innerHTML = "Open another template";
        button.id = "open-template";
        button.addEventListener('click', async () => {
            ipc.send<{}>('dreamers:change-template', { params: [TestRenderer.getViewPath()] });
        });
        parentElement.appendChild(button);
        parentElement.appendChild(imageContainer);

        document.body.appendChild(parentElement);
    }

    public static getViewPath(): string {
        return path.join(__dirname, MainRenderer.viewPath);
    }
}