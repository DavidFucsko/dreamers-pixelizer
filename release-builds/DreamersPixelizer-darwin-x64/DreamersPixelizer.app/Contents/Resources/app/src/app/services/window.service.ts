import { WindowInterface } from '../abstracts/interfaces/window.interface';

export class WindowService {
    private static instance: WindowService;
    private windows: WindowInterface[] = [];

    private constructor() {
    }

    public static getWindowService(): WindowService {
        if (!WindowService.instance) {
            WindowService.instance = new WindowService();
        }
        return WindowService.instance;
    }

    public registerWindow(windowToCreate: WindowInterface) {
        this.windows.push(windowToCreate);
    }

    public registerWindows(windowsToCreate: WindowInterface[]) {
        windowsToCreate.forEach(windowToCreate => this.registerWindow(windowToCreate));
    }

    public getWindows(): WindowInterface[] {
        return this.windows;
    }

    public createBrowserWindows(): void {
        this.windows.forEach(window => window.createWindow(window.getDefaultOptions()));
    }

    public loadViews(): void {
        this.windows.forEach(window => window.loadView());
    }

    public destroyBrowserWindow(windowId: string) {
        const windowToDestroy = this.windows.find(window => window.getWindowId() === windowId);
        windowToDestroy.destroyWindow();
    }
}