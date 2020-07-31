import { WindowInterface } from '../interfaces/window.interface';
import { BrowserWindow } from 'electron';

export class WindowService {
    private windows: BrowserWindow[] = [];

    public registerWindow(windowToCreate: WindowInterface) {
        this.windows.push(windowToCreate.getWindow());
    }

    public registerWindows(windowsToCreaete: WindowInterface[]) {
        windowsToCreaete.forEach(windowToCreate => this.registerWindow(windowToCreate));
    }

    public getWindows(): BrowserWindow[] {
        return this.windows;
    }
}