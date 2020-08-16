import { WindowInterface } from '../abstracts/interfaces/window.interface';
import { BrowserWindow } from 'electron';

export class SplashWindow implements WindowInterface {
    private window: BrowserWindow;
    private viewPath: string;
    private static windowId: string = 'splash';

    constructor(viewPath: string) {
        this.viewPath = viewPath;
    }

    private static defaultOptions = {
        width: 800,
        height: 600,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        backgroundColor: '#1E1E1E',
        webPreferences: {
            nodeIntegration: true,
        }
    }

    public getWindow(): BrowserWindow {
        return this.window;
    }
    public createWindow(options: Electron.BrowserWindowConstructorOptions): void {
        this.window = new BrowserWindow({
            ...SplashWindow.defaultOptions,
            ...options
        });
    }
    public getDefaultOptions(): Electron.BrowserWindowConstructorOptions {
        return SplashWindow.defaultOptions;
    }
    public loadView(): void {
        this.getWindow().loadFile(this.viewPath);
    }

    public setViewPath(viewPath: string) {
        this.viewPath = viewPath;
    }
    public destroyWindow(): void {
        this.getWindow().destroy();
    }
    public getWindowId(): string {
        return SplashWindow.windowId;
    }
}