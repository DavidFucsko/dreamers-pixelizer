import { BrowserWindow } from 'electron';
import { RendererBaseClass } from '../classes/renderer.base';

export interface WindowInterface {
    getWindow(): BrowserWindow;
    createWindow(options: Electron.BrowserWindowConstructorOptions): BrowserWindow;
    getDefaultOptions(): Electron.BrowserWindowConstructorOptions;
    loadView(): void;
}