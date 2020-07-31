import * as path from "path";

import { BrowserWindow } from 'electron';

import { WindowInterface } from '../interfaces/window.interface';

export class MainWindow implements WindowInterface {
    private window: BrowserWindow;

    private static defaultOptions = {
        height: 600,
        width: 800,
        title: `Dreamers`,
        webPreferences: {
            nodeIntegration: true, // makes it possible to use `require` within our index.html
            preload: path.join(path.dirname(require.main.filename), "preload.js"),
        }
    };

    private static windowView = '../views/templates/main.html';

    public getWindow(): BrowserWindow {
        if (!this.window) {
            this.window = this.createWindow(MainWindow.defaultOptions);
        }
        return this.window;
    }

    private createWindow(options: Electron.BrowserWindowConstructorOptions): BrowserWindow {
        const newWindow = new BrowserWindow(options);
        newWindow.webContents.openDevTools();
        newWindow.loadFile(path.join(__dirname, MainWindow.windowView));

        return newWindow;
    }
}