import { WindowInterface } from '../interfaces/window.interface';

export class WindowService {
    private windows: WindowInterface[] = [];

    public registerWindow(windowToCreate: WindowInterface) {
        this.windows.push(windowToCreate);
    }

    public registerWindows(windowsToCreaete: WindowInterface[]) {
        windowsToCreaete.forEach(windowToCreate => this.registerWindow(windowToCreate));
    }

    public getWindows(): WindowInterface[] {
        return this.windows;
    }
}