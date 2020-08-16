export class DreamersSlider {

    public slider: HTMLInputElement;
    public label: HTMLLabelElement;

    public static createViewPart(
        parentElement: HTMLElement,
        label: string,
        step: string,
        min: string,
        max: string,
        defaultValue?: string): DreamersSlider {
        const dreamersSlider = new DreamersSlider();

        const inputSliderDiv = document.createElement('div');
        const inputSliderTitle = document.createElement('p');
        const generatedId = label.replace(' ', '').toLowerCase() + '_slider';
        inputSliderTitle.innerText = label;
        dreamersSlider.slider = document.createElement('input');
        dreamersSlider.slider.type = 'range';
        dreamersSlider.slider.step = step;
        dreamersSlider.slider.min = min;
        dreamersSlider.slider.max = max
        dreamersSlider.slider.value = defaultValue ? defaultValue : '';
        dreamersSlider.slider.id = generatedId;
        dreamersSlider.label = document.createElement('label');
        dreamersSlider.label.htmlFor = generatedId;
        dreamersSlider.label.innerText = dreamersSlider.slider.value;
        inputSliderDiv.appendChild(inputSliderTitle);
        inputSliderDiv.appendChild(dreamersSlider.slider);
        inputSliderDiv.appendChild(dreamersSlider.label);

        parentElement.appendChild(inputSliderDiv);
        return dreamersSlider;
    }
}