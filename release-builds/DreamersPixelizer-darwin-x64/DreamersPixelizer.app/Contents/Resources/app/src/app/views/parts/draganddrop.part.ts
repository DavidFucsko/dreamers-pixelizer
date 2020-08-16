import { openFileByPath } from "../../../common";
import { ImageDrawer } from "./image-drawer.part";

export class DragAndDropContainer {

    public dragAndDropTitle: HTMLDivElement;
    public dragAndDropText: HTMLSpanElement;

    public static createViewPart(parentElement: HTMLElement, sourceImageContainer: ImageDrawer): DragAndDropContainer {
        const dragAndDropContainer = new DragAndDropContainer();
        dragAndDropContainer.dragAndDropTitle = document.createElement('div');
        dragAndDropContainer.dragAndDropTitle.className = 'absolute';
        dragAndDropContainer.dragAndDropText = document.createElement('span');
        dragAndDropContainer.dragAndDropText.innerText = 'Drag and Drop Files here or click to browse'
        dragAndDropContainer.dragAndDropTitle.appendChild(dragAndDropContainer.dragAndDropText);

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
            dragAndDropContainer.dragAndDropText.innerText = '';
            openFileByPath(event.dataTransfer.files[0].path)
                .then(result => {
                    sourceImageContainer.drawImage(result.file);
                })
                .catch(error => error.message);
        };

        parentElement.appendChild(dragAndDropContainer.dragAndDropTitle);

        return dragAndDropContainer;
    }
}