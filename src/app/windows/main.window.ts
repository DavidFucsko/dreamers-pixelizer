import * as path from "path";

import { BrowserWindow } from 'electron';

import { WindowInterface } from '../interfaces/window.interface';
import { RendererInterface } from '../interfaces/renderer.interface';

export class MainWindow implements WindowInterface {
    private window: BrowserWindow;

    private renderer: RendererInterface;

    private static defaultOptions = {
        height: 600,
        width: 800,
        title: `Dreamers`,
        webPreferences: {
            nodeIntegration: true, // makes it possible to use `require` within our index.html
            preload: path.join(path.dirname(require.main.filename), "preload.js"),
        }
    };

    public getWindow(): BrowserWindow {
        if (!this.window) {
            this.window = this.createWindow(MainWindow.defaultOptions);
        }
        return this.window;
    }

    public registerRenderer(renderer: RendererInterface) {
        this.renderer = renderer;
        const window = this.getWindow();
        window.loadFile(renderer.getViewPath());
    }

    public renderWindowView() {
        this.renderer.render();
    }

    private createWindow(options: Electron.BrowserWindowConstructorOptions): BrowserWindow {
        const newWindow = new BrowserWindow(options);
        newWindow.webContents.openDevTools();
        return newWindow;
    }
}