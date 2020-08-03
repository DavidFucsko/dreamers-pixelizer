import * as path from "path";

import { BrowserWindow } from 'electron';

import { WindowInterface } from '../abstracts/interfaces/window.interface';

export class MainWindow implements WindowInterface {
    private window: BrowserWindow;
    private windowOptions: Electron.BrowserWindowConstructorOptions;
    private viewPath: string;

    constructor(windowOptions: Electron.BrowserWindowConstructorOptions, viewPath: string) {
        this.windowOptions = windowOptions;
        this.viewPath = viewPath;
    }

    private static defaultOptions: Electron.BrowserWindowConstructorOptions = {
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

    public setViewPath(newPath: string) {
        this.viewPath = newPath;
    }

    public loadView(): void {
        this.getWindow().loadFile(this.viewPath);
    }

    public createWindow(options: Electron.BrowserWindowConstructorOptions): BrowserWindow {
        const newWindow = new BrowserWindow({ ...options, ...this.windowOptions });
        newWindow.webContents.openDevTools();
        this.window = newWindow;
        return newWindow;
    }

    public getDefaultOptions() {
        return MainWindow.defaultOptions;
    }
}