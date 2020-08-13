import { ipcRenderer } from 'electron';
import { FileOpenResponse } from '../../../common/responses/file-open-response.interface';
import { DreamersImageData } from '../../../common/models/dreamers-image.model';

export class ImageDrawer {

    private constructor() { }
    private canvas: HTMLCanvasElement;
    private image: HTMLImageElement;

    public static createViewPart(parentElement: HTMLElement): ImageDrawer {
        const imageDrawer = new ImageDrawer();
        imageDrawer.image = new Image();
        imageDrawer.canvas = document.createElement('canvas');
        parentElement.appendChild(imageDrawer.canvas);
        return imageDrawer;
    }

    public getImgSrc(): string {
        return this.image.src.replace('data:image/png;base64,', '');
    }

    public getImgData(): ImageData {
        const ctx = this.canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        return imageData;
    }

    public drawImage(file: string): void {
        this.image.onload = () => {
            this.canvas.width = this.image.width;
            this.canvas.height = this.image.height;
            ctx.drawImage(this.image, 0, 0);
        };
        const ctx = this.canvas.getContext('2d');
        this.setImgSource(file);
    }

    public putImageData(imgData: DreamersImageData) {
        const ctx = this.canvas.getContext('2d');
        const trueData = new ImageData(imgData.pixels, imgData.width, imgData.height);
        this.canvas.width = imgData.width;
        this.canvas.height = imgData.height;
        ctx.putImageData(trueData, 0, 0);
    }

    public subscribeForIpcEvent(ipcEventName: string): void {
        ipcRenderer.on(ipcEventName, (_, message: FileOpenResponse) => {
            this.drawImage(message.file);
        });
    }

    private setImgSource(base64File: string): void {
        this.image.src = "data:image/png;base64," + base64File;
    }
}