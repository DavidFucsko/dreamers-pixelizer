import { BrowserWindow } from 'electron';
import { WindowInterface } from '../abstracts/interfaces/window.interface';

export class WindowService {
    private windows: WindowInterface[] = [];
    private windowInstances: BrowserWindow[] = [];

    public registerWindow(windowToCreate: WindowInterface) {
        this.windows.push(windowToCreate);
    }

    public registerWindows(windowsToCreaete: WindowInterface[]) {
        windowsToCreaete.forEach(windowToCreate => this.registerWindow(windowToCreate));
    }

    public getWindows(): WindowInterface[] {
        return this.windows;
    }

    public createWindows(): void {
        this.windows.forEach(window => this.windowInstances.push(window.createWindow(window.getDefaultOptions())));
    }

    public getWindowInstances(): BrowserWindow[] {
        return this.windowInstances;
    }

    public loadViews(): void {
        this.windows.forEach(window => window.loadView());
    }
}