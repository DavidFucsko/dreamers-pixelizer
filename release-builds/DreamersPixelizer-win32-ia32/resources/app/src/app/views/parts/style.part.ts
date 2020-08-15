export class StylePart {

    public static applyStyles() {
        const shellBackground = '#1E1E1E';
        const shellForeground = '#CCCCCC';
        const style = document.createElement('style');
        style.className = 'initialShellColors';
        document.head.appendChild(style);
        style.innerHTML = `body {
            padding: 10px;
            background-color: ${shellBackground};
            color: ${shellForeground}; margin: 0; padding: 0;
            font-family: Roboto, sans-serif;
        }
            .container-after-titlebar {
                padding: 10px;
            }
            .imageDrawer {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .controlContainer{
                display: flex;
                justify-content: space-evenly;
                align-items: center;
            }
            .buttonContainer {
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                margin-bottom: 20px;
                margin-top: 25px;
            }
            .btn {
                background: none;
                cursor: pointer;
                line-height: 1.5;
                font: 100 1rem 'Roboto Slab', sans-serif;
                padding: .5em 1em;
                letter-spacing: 0.05rem;
                border: 1px solid #50555C;
                color: #cccccc;
            }
            input[type=range] {
                background: transparent;
                height: 20px;
                -webkit-appearance: none;
                margin: 10px 0;
                width: 100%;
              }
              input[type=range]:focus {
                outline: none;
              }
              input[type=range]::-webkit-slider-runnable-track {
                width: 100%;
                height: 7px;
                cursor: pointer;
                animate: 0.2s;
                box-shadow: 1px 1px 1px #50555C;
                background: #50555C;
                border-radius: 0px;
                border: 0px solid #000000;
              }
              input[type=range]::-webkit-slider-thumb {
                box-shadow: 0px 0px 0px #000000;
                border: 0px solid #000000;
                height: 14px;
                width: 27px;
                border-radius: 4px;
                background: #529DE1;
                cursor: pointer;
                -webkit-appearance: none;
                margin-top: -3.5px;
              }
              input[type=range]:focus::-webkit-slider-runnable-track {
                background: #50555C;
              }
              input[type=range]::-moz-range-track {
                width: 100%;
                height: 7px;
                cursor: pointer;
                animate: 0.2s;
                box-shadow: 1px 1px 1px #50555C;
                background: #50555C;
                border-radius: 0px;
                border: 0px solid #000000;
              }
              input[type=range]::-moz-range-thumb {
                box-shadow: 0px 0px 0px #000000;
                border: 0px solid #000000;
                height: 14px;
                width: 27px;
                border-radius: 4px;
                background: #529DE1;
                cursor: pointer;
              }
              input[type=range]::-ms-track {
                width: 100%;
                height: 7px;
                cursor: pointer;
                animate: 0.2s;
                background: transparent;
                border-color: transparent;
                color: transparent;
              }
              input[type=range]::-ms-fill-lower {
                background: #50555C;
                border: 0px solid #000000;
                border-radius: 0px;
                box-shadow: 1px 1px 1px #50555C;
              }
              input[type=range]::-ms-fill-upper {
                background: #50555C;
                border: 0px solid #000000;
                border-radius: 0px;
                box-shadow: 1px 1px 1px #50555C;
              }
              input[type=range]::-ms-thumb {
                margin-top: 1px;
                box-shadow: 0px 0px 0px #000000;
                border: 0px solid #000000;
                height: 14px;
                width: 27px;
                border-radius: 4px;
                background: #529DE1;
                cursor: pointer;
              }
              input[type=range]:focus::-ms-fill-lower {
                background: #50555C;
              }
              input[type=range]:focus::-ms-fill-upper {
                background: #50555C;
              }
              /* .slideOne */
            .slideOne {
                width: 50px;
                height: 8px;
                background: #50555C;
                margin: 20px auto;
                margin-left: 2px;
                margin-top: 2em;
                position: relative;
                border-radius: 2px;
            }
            .slideOne > label {
                display: block;
                width: 16px;
                height: 16px;
                position: absolute;
                top: -3px;
                left: -3px;
                cursor: pointer;
                background: #fcfff4;
                background: linear-gradient(to bottom, #529de1 0%, #529de1 40%, #529de1 100%);
                border-radius: 3px;
                box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);
                transition: all 0.4s ease;
              }
              input[type=checkbox] {
                visibility: hidden;
              }
              input[type=checkbox]:checked + label {
                left: 37px;
              }`;
    }
}