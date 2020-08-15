import { IpcService } from '../../services/ipc.service';
import { RendererBaseClass } from '../../abstracts/classes/renderer.base';
import { StylePart } from '../parts/style.part';
import { ImageDrawer } from '../parts/image-drawer.part';
import { DreamersButton } from '../parts/button.part';
import { FileOpenResponse } from '../../../common/responses/file-open-response.interface';
import { PixelizeImageRequest, PixelizeImageRequestParams } from '../../../electron/ipc/pixelize-image.request';
import { PixelizeImageResponse } from '../../../common/responses/pixelize-image-response.interface';
import { openFileByPath } from '../../../common/handlers/file-open.handler';

export class MainRenderer extends RendererBaseClass {

    public static viewPath = '../templates/main.html';
    public static dirName = __dirname;

    public render(): void {
        const ipc = new IpcService();

        StylePart.applyStyles();
        const parentElement = document.createElement('div');

        const imageDrawerDiv = document.createElement('div');
        imageDrawerDiv.className = 'imageDrawer';
        const sourceImageContainer = ImageDrawer.createViewPart(imageDrawerDiv);
        const pixelizedImageContainer = ImageDrawer.createViewPart(imageDrawerDiv);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttonContainer';
        const openButton = DreamersButton.createViewPart(buttonContainer, 'Open Image');
        const pixelizeButton = DreamersButton.createViewPart(buttonContainer, 'Pixelize Image');
        const saveButton = DreamersButton.createViewPart(buttonContainer, 'Save Image');
        saveButton.id = 'saveButton';

        const blockInputSliderDiv = document.createElement('div');
        const inputSliderTitle = document.createElement('p');
        inputSliderTitle.innerText = 'Pixel block count';
        const blockInputSlider = document.createElement('input');
        blockInputSlider.type = 'range';
        blockInputSlider.step = '4';
        blockInputSlider.min = '16';
        blockInputSlider.max = '64'
        blockInputSlider.id = 'block';
        blockInputSlider.value = '48';
        const blockLabel = document.createElement('label');
        blockLabel.htmlFor = 'block';
        blockLabel.innerText = blockInputSlider.value;
        blockInputSliderDiv.appendChild(inputSliderTitle);
        blockInputSliderDiv.appendChild(blockInputSlider);
        blockInputSliderDiv.appendChild(blockLabel);

        const colorInputSliderDiv = document.createElement('div');
        const colorInputSliderTitle = document.createElement('p');
        colorInputSliderTitle.innerText = 'Color Density'
        const colorInputSlider = document.createElement('input');
        colorInputSlider.type = 'range';
        colorInputSlider.step = '0.02';
        colorInputSlider.min = '0.02';
        colorInputSlider.max = '1';
        colorInputSlider.id = 'colorInput'
        colorInputSlider.value = '0.4';
        const colorLabel = document.createElement('label');
        colorLabel.htmlFor = 'colorInput';
        colorLabel.innerText = colorInputSlider.value;
        colorInputSliderDiv.appendChild(colorInputSliderTitle);
        colorInputSliderDiv.appendChild(colorInputSlider);
        colorInputSliderDiv.appendChild(colorLabel);

        const removeColorPortion = document.createElement('div');
        const removeColorPortionSliderTitle = document.createElement('p');
        removeColorPortionSliderTitle.innerText = 'Remove Color Portion'
        const removeColorPortionSlider = document.createElement('input');
        removeColorPortionSlider.type = 'range';
        removeColorPortionSlider.step = '0.1';
        removeColorPortionSlider.min = '0.1';
        removeColorPortionSlider.max = '1';
        removeColorPortionSlider.id = 'removeColorInput'
        removeColorPortionSlider.value = '0.4';
        const removeColorPortionLabel = document.createElement('label');
        removeColorPortionLabel.htmlFor = 'removeColorInput';
        removeColorPortionLabel.innerText = removeColorPortionSlider.value;
        removeColorPortion.appendChild(removeColorPortionSliderTitle);
        removeColorPortion.appendChild(removeColorPortionSlider);
        removeColorPortion.appendChild(removeColorPortionLabel);

        sourceImageContainer.subscribeForOpenIpcEvent();
        pixelizedImageContainer.subscribeForSaveIpcEvent();

        const checkboxDiv = document.createElement('div');

        const checkboxTitle = document.createElement('span');
        checkboxTitle.innerText = 'Remove Similar Colors';

        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'slideOne';
        const removeSimilarColorsChkBox = document.createElement('input');
        removeSimilarColorsChkBox.type = 'checkbox';
        removeSimilarColorsChkBox.id = 'removechk';
        removeSimilarColorsChkBox.className = 'slideOne';

        const checkBoxLabel = document.createElement('label');
        checkBoxLabel.htmlFor = 'removechk';
        checkboxContainer.appendChild(removeSimilarColorsChkBox);
        checkboxContainer.appendChild(checkBoxLabel);
        checkboxDiv.appendChild(checkboxTitle);
        checkboxDiv.appendChild(checkboxContainer);

        const controlContainer = document.createElement('div');
        controlContainer.className = 'controlContainer';
        controlContainer.appendChild(blockInputSliderDiv);
        controlContainer.appendChild(colorInputSliderDiv);
        controlContainer.appendChild(checkboxDiv);
        controlContainer.appendChild(removeColorPortion);

        parentElement.appendChild(imageDrawerDiv);
        parentElement.appendChild(buttonContainer);
        parentElement.appendChild(controlContainer);

        blockInputSlider.oninput = () => {
            blockLabel.innerText = blockInputSlider.value;
            this.pixelizeImage(
                blockInputSlider,
                sourceImageContainer,
                colorInputSlider,
                pixelizedImageContainer,
                removeSimilarColorsChkBox,
                removeColorPortionSlider,
                ipc)
        };

        removeColorPortionSlider.oninput = () => {
            removeColorPortionLabel.innerText = removeColorPortionSlider.value;
            this.pixelizeImage(
                blockInputSlider,
                sourceImageContainer,
                colorInputSlider,
                pixelizedImageContainer,
                removeSimilarColorsChkBox,
                removeColorPortionSlider,
                ipc)
        };

        colorInputSlider.oninput = () => {
            colorLabel.innerText = colorInputSlider.value;
            this.pixelizeImage(
                blockInputSlider,
                sourceImageContainer,
                colorInputSlider,
                pixelizedImageContainer,
                removeSimilarColorsChkBox,
                removeColorPortionSlider,
                ipc)
        };

        removeSimilarColorsChkBox.oninput = () => {
            colorLabel.innerText = colorInputSlider.value;
            this.pixelizeImage(
                blockInputSlider,
                sourceImageContainer,
                colorInputSlider,
                pixelizedImageContainer,
                removeSimilarColorsChkBox,
                removeColorPortionSlider,
                ipc)
        }

        document.body.appendChild(parentElement);

        openButton.addEventListener('click', async () => {
            const response = await ipc.send<FileOpenResponse>('dreamers:open-file-dialog');
            sourceImageContainer.drawImage(response.file);
        });

        saveButton.addEventListener('click', async () => {
            this.saveFile(ipc, pixelizedImageContainer);
        });

        pixelizeButton.addEventListener('click', this.pixelizeImage.bind(this,
            blockInputSlider,
            sourceImageContainer,
            colorInputSlider,
            pixelizedImageContainer,
            removeSimilarColorsChkBox,
            removeColorPortionSlider,
            ipc));

        parentElement.ondragover = () => {
            return false;
        };

        parentElement.ondragleave = () => {
            return false;
        };

        parentElement.ondragend = () => {
            return false;
        };

        parentElement.ondrop = (event) => {
            openFileByPath(event.dataTransfer.files[0].path)
                .then(result => {
                    sourceImageContainer.drawImage(result.file);
                })
                .catch(error => error.message);
        };
    }

    private async saveFile(ipc: IpcService, imageDrawer: ImageDrawer) {
        const saveFileResponse = await ipc.send<{ filePath: string }>('dreamers:save-file-dialog');
        imageDrawer.saveImage(saveFileResponse.filePath);
    }

    private async pixelizeImage(
        blockInputSlider: HTMLInputElement,
        sourceImageContainer: ImageDrawer,
        colorInputSlider: HTMLInputElement,
        pixelizedImageContainer: ImageDrawer,
        removeSimilarColorsChkBox: HTMLInputElement,
        removeColorPortionSlider: HTMLInputElement,
        ipc: IpcService) {
        document.body.style.cursor = 'wait';
        const sourceImgData = sourceImageContainer.getImgData();
        const response = await ipc.send<PixelizeImageResponse>(
            'dreamers:pixelize-image',
            {
                params: {
                    pixelData: sourceImgData.data,
                    width: sourceImgData.width,
                    height: sourceImgData.height,
                    blockSize: Number(blockInputSlider.value),
                    propotionOfColor: Number(colorInputSlider.value),
                    removeSimilarColors: removeSimilarColorsChkBox.checked,
                    removeColorPortion: Number(removeColorPortionSlider.value)
                } as PixelizeImageRequestParams
            } as PixelizeImageRequest);
        pixelizedImageContainer.putImageData(response.pixelArtImage);
        document.body.style.cursor = 'default';
    };
}