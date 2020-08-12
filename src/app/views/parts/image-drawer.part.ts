import { ipcRenderer } from 'electron';
import { FileOpenResponse } from '../../../common/interfaces/file-open-response.interface';

export class ImageDrawer {

    public static createViewPart(parentElement: HTMLElement): HTMLImageElement {
        const imageElement = document.createElement('img');
        parentElement.appendChild(imageElement);
        this.subscribeForEvents(imageElement);
        return imageElement;
    }

    public static setImgSrc(imgElement: HTMLImageElement, file: string) {
        imgElement.src = "data:image/png;base64," + file;
    }

    public static getSourceImg(imgElement: HTMLImageElement) {
        return imgElement.src.replace('data:image/png;base64,', '');
    }

    private static subscribeForEvents(imgElement: HTMLImageElement) {
        ipcRenderer.on('dreamers:show-image', (event, message: FileOpenResponse) => {
            imgElement.src = "data:image/png;base64," + message.file;
        });
    }
}