export class DreamersButton {

    public static createViewPart(parentElement: HTMLElement, label: string): HTMLButtonElement {
        const buttonElement = document.createElement('button');
        buttonElement.innerHTML = label;
        parentElement.appendChild(buttonElement);
        buttonElement.className = 'btn draw-border';
        return buttonElement;
    }
}