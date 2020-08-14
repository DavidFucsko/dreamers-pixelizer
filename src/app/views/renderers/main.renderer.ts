import { IpcService } from '../../services/ipc.service';
import { RendererBaseClass } from '../../abstracts/classes/renderer.base';
import { Color } from '../parts/color.part';
import { ImageDrawer } from '../parts/image-drawer.part';
import { DreamersButton } from '../parts/button.part';
import { FileOpenResponse } from '../../../common/responses/file-open-response.interface';
import { PixelizeImageRequest } from '../../../electron/ipc/pixelize-image.request';
import { PixelizeImageResponse } from '../../../common/responses/pixelize-image-response.interface';
import { openFileByPath } from '../../../common/handlers/file-open.handler';

export class MainRenderer extends RendererBaseClass {

    public static viewPath = '../templates/main.html';
    public static dirName = __dirname;

    public render(): void {
        const ipc = new IpcService();

        Color.colorizeShell();
        const parentElement = document.createElement('div');
        const sourceImageContainer = ImageDrawer.createViewPart(parentElement);
        const pixelizedImageContainer = ImageDrawer.createViewPart(parentElement);

        const buttonContainer = document.createElement('div');
        const openButton = DreamersButton.createViewPart(buttonContainer, "Open Image");
        const pixelizeButton = DreamersButton.createViewPart(buttonContainer, "Pixelize Image");
        parentElement.appendChild(buttonContainer);

        const blockInputSliderDiv = document.createElement('div');
        const inputSliderTitle = document.createElement('p');
        inputSliderTitle.innerText = 'Pixel block count: ';
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

        sourceImageContainer.subscribeForIpcEvent('dreamers:show-image');

        parentElement.appendChild(blockInputSliderDiv);
        parentElement.appendChild(colorInputSliderDiv);

        blockInputSlider.oninput = () => {
            blockLabel.innerText = blockInputSlider.value;
            this.pixelizeImage(
                blockInputSlider,
                sourceImageContainer,
                colorInputSlider,
                pixelizedImageContainer,
                ipc)
        };

        colorInputSlider.oninput = () => {
            colorLabel.innerText = colorInputSlider.value;
            this.pixelizeImage(
                blockInputSlider,
                sourceImageContainer,
                colorInputSlider,
                pixelizedImageContainer,
                ipc)
        };

        document.body.appendChild(parentElement);

        openButton.addEventListener('click', async () => {
            const response = await ipc.send<FileOpenResponse>('dreamers:open-file-dialog');
            sourceImageContainer.drawImage(response.file);
        });

        pixelizeButton.addEventListener('click', this.pixelizeImage.bind(this,
            blockInputSlider,
            sourceImageContainer,
            colorInputSlider,
            pixelizedImageContainer,
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

    private async pixelizeImage(
        blockInputSlider: HTMLInputElement,
        sourceImageContainer: ImageDrawer,
        colorInputSlider: HTMLInputElement,
        pixelizedImageContainer: ImageDrawer,
        ipc: IpcService) {
        const sourceImgData = sourceImageContainer.getImgData();
        const response = await ipc.send<PixelizeImageResponse>(
            'dreamers:pixelize-image',
            {
                params: {
                    pixelData: sourceImgData.data,
                    width: sourceImgData.width,
                    height: sourceImgData.height,
                    blockSize: Number(blockInputSlider.value),
                    propotionOfColor: Number(colorInputSlider.value)
                }
            } as PixelizeImageRequest);
        pixelizedImageContainer.putImageData(response.pixelArtImage);
    };
}