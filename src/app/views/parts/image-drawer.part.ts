import { ipcRenderer } from 'electron';

export class ImageDrawer {
    private imageElement: HTMLImageElement;

    constructor(parentElement: HTMLElement) {
        this.subscribeForEvents();
        this.imageElement = this.createViewPart(parentElement);
    }

    private createViewPart(parentElement: HTMLElement) {
        const imageElement = document.createElement('img');
        parentElement.appendChild(imageElement);
        return imageElement;
    }

    private subscribeForEvents() {
        ipcRenderer.on('dreamers:show-image', (event, message: { file: string, path: string }) => {
            this.setImageSrc(message.file);
        });
    }

    public setImageSrc(newSrc: string) {
        this.imageElement.src = "data:image/png;base64," + newSrc;
    }

    public getImageSrc() {
        const result = this.imageElement.src;
        return result;
    }
}