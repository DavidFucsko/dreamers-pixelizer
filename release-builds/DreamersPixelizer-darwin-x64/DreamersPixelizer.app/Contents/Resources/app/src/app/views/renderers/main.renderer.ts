import { FileOpenResponse, PixelizeImageResponse } from '../../../common';
import { IpcService } from '../../services/ipc.service';
import { RendererBaseClass } from '../../abstracts/classes/renderer.base';
import {
    PixelizeImageRequest,
    PixelizeImageRequestParams,
    PixelizeImageRequestInputParams
} from '../../../electron';
import { ImageDrawer, StylePart, DragAndDropContainer, DreamersButton, DreamersSlider, DreamersCheckBox } from '../parts';

export class MainRenderer extends RendererBaseClass {

    public static viewPath = '../templates/main.html';
    public static dirName = __dirname;

    private sourceImageContainer: ImageDrawer;
    private pixelizedImageContainer: ImageDrawer;
    private ipc = new IpcService();

    private pixelizeParameters: PixelizeImageRequestInputParams = {
        blockSize: '32',
        propotionOfColor: '0.4',
        removeSimilarColors: false,
        removeColorPortion: '0.2'
    };

    public render(): void {
        StylePart.applyStyles();

        const mainElement = document.createElement('div');

        const imageDrawerContainer = this.createImageContainerPart();
        const buttonContainer = this.createButtonContainerPart();
        const controlsContainer = this.createControlsContainerPart();

        this.addListOfPartsToView(mainElement, [imageDrawerContainer, buttonContainer, controlsContainer]);

        document.body.appendChild(mainElement);
    }

    private createImageContainerPart() {
        const imageDrawerContainer = document.createElement('div');
        imageDrawerContainer.className = 'imageDrawer';
        this.sourceImageContainer = ImageDrawer.createViewPart(imageDrawerContainer);
        this.pixelizedImageContainer = ImageDrawer.createViewPart(imageDrawerContainer);
        this.sourceImageContainer.subscribeForOpenIpcEvent();
        this.pixelizedImageContainer.subscribeForSaveIpcEvent();

        DragAndDropContainer.createViewPart(
            imageDrawerContainer,
            this.sourceImageContainer);

        return imageDrawerContainer;
    }

    private createButtonContainerPart() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttonContainer';
        const openButton = DreamersButton.createViewPart(buttonContainer, 'Open Image');
        const pixelizeButton = DreamersButton.createViewPart(buttonContainer, 'Pixelize Image');
        const saveButton = DreamersButton.createViewPart(buttonContainer, 'Save Image');

        openButton.onclick = this.onOpenFileDialog.bind(this);
        saveButton.onclick = this.saveFile.bind(this);
        pixelizeButton.onclick = this.pixelizeImage.bind(this);

        return buttonContainer;
    }

    private createControlsContainerPart() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'controlContainer';

        const blockInputSlider = DreamersSlider.createViewPart(
            controlsContainer,
            'Pixel block count',
            '4',
            '16',
            '128',
            '48');
        blockInputSlider.slider.oninput =
            this.onSliderInput.bind(this, 'blockSize', blockInputSlider);
        const colorInputSlider = DreamersSlider.createViewPart(
            controlsContainer,
            'Color Density',
            '0.02',
            '0.02',
            '1',
            '0.4');
        colorInputSlider.slider.oninput =
            this.onSliderInput.bind(this, 'propotionOfColor', colorInputSlider);
        const removeColorPortionSlider = DreamersSlider.createViewPart(
            controlsContainer,
            'Remove Color Portion',
            '0.1',
            '0.1',
            '1',
            '0.4');
        removeColorPortionSlider.slider.oninput =
            this.onSliderInput.bind(this, 'removeColorPortion', removeColorPortionSlider);

        const removeSimilarColorsChkBox = DreamersCheckBox.createViewPart(controlsContainer, 'Remove Similar Colors');
        removeSimilarColorsChkBox.oninput = this.onInputRemoveColors.bind(this, removeSimilarColorsChkBox);

        return controlsContainer;
    }

    private async onOpenFileDialog() {
        const response = await this.ipc.send<FileOpenResponse>('dreamers:open-file-dialog');
        this.sourceImageContainer.drawImage(response.file);
    }

    private onSliderInput(storageValueReference: string, dreamersSlider: DreamersSlider) {
        this.pixelizeParameters[storageValueReference] = dreamersSlider.slider.value;
        dreamersSlider.label.innerText = dreamersSlider.slider.value;
        this.pixelizeImage();
    }

    private onInputRemoveColors(chekBox: HTMLInputElement) {
        this.pixelizeParameters.removeSimilarColors = chekBox.checked;
        this.pixelizeImage();
    }

    private async pixelizeImage() {
        document.body.style.cursor = 'wait';
        const sourceImgData = this.sourceImageContainer.getImgData();
        const response = await this.ipc.send<PixelizeImageResponse>(
            'dreamers:pixelize-image',
            {
                params: {
                    pixelData: sourceImgData.data,
                    width: sourceImgData.width,
                    height: sourceImgData.height,
                    blockSize: Number(this.pixelizeParameters.blockSize),
                    propotionOfColor: Number(this.pixelizeParameters.propotionOfColor),
                    removeSimilarColors: this.pixelizeParameters.removeSimilarColors,
                    removeColorPortion: Number(this.pixelizeParameters.removeColorPortion)
                } as PixelizeImageRequestParams
            } as PixelizeImageRequest);
        this.pixelizedImageContainer.putImageData(response.pixelArtImage);
        document.body.style.cursor = 'default';
    };

    private async saveFile() {
        const saveFileResponse = await this.ipc.send<{ filePath: string }>('dreamers:save-file-dialog');
        this.pixelizedImageContainer.saveImage(saveFileResponse.filePath);
    }

    private addListOfPartsToView(view: HTMLElement, elements: HTMLElement[]) {
        elements.forEach(element => view.appendChild(element));
    }
}