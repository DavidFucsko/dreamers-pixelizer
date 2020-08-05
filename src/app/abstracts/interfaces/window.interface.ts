import { BrowserWindow } from 'electron';

export interface WindowInterface {
    getWindow(): BrowserWindow;
    createWindow(options: Electron.BrowserWindowConstructorOptions): void;
    getDefaultOptions(): Electron.BrowserWindowConstructorOptions;
    loadView(): void;
    destroyWindow(): void;
    getWindowId(): string;
    setViewPath(viewPath: string): void;
}