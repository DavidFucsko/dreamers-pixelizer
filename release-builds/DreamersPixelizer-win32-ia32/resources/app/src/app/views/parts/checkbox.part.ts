export class DreamersCheckBox {
    public static createViewPart(parentElement: HTMLElement, title: string): HTMLInputElement {
        const checkboxDiv = document.createElement('div');

        const checkboxTitle = document.createElement('span');
        checkboxTitle.innerText = title;

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

        parentElement.appendChild(checkboxDiv);

        return removeSimilarColorsChkBox;
    }
}