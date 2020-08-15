import { ipcRenderer } from 'electron';
import { FileOpenResponse } from '../../../common/responses/file-open-response.interface';
import { DreamersImageData } from '../../../common/models/dreamers-image.model';
import * as fs from 'fs';

export class ImageDrawer {

    private constructor() { }
    private canvas: HTMLCanvasElement;
    private image: HTMLImageElement;

    public static createViewPart(parentElement: HTMLElement): ImageDrawer {
        const imageDrawer = new ImageDrawer();
        imageDrawer.image = new Image();
        imageDrawer.canvas = document.createElement('canvas');
        imageDrawer.canvas.width = 400;
        imageDrawer.canvas.height = 300;
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
            const imagePropotion = this.image.width / this.image.height;
            this.canvas.width = 800;
            this.canvas.height = 800 / imagePropotion;

            ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
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

    public subscribeForOpenIpcEvent(): void {
        ipcRenderer.on('dreamers:show-image', (_, message: FileOpenResponse) => {
            this.drawImage(message.file);
        });
    }

    public subscribeForSaveIpcEvent(): void {
        ipcRenderer.on('dreamers:save-image', (_, message: { filePath: string }) => {
            this.saveImage(message.filePath);
        });
    }

    public saveImage(filePath: string) {
        const url: string = this.getFileDatUrl();
        const base64Data = url.replace(/^data:image\/png;base64,/, "");
        fs.writeFile(filePath, base64Data, 'base64', (err) => {
            return new Error(err.message);
        });
    }

    public getFileDatUrl(): string {
        return this.canvas.toDataURL('img/jpg', 0.8);
    }

    private setImgSource(base64File: string): void {
        this.image.src = "data:image/png;base64," + base64File;
    }
}