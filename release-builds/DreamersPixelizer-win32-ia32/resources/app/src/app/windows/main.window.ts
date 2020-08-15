import * as path from "path";

import { BrowserWindow } from 'electron';

import { WindowInterface } from '../abstracts/interfaces/window.interface';
import { WindowService } from '../services/window.service';

export class MainWindow implements WindowInterface {
    private window: BrowserWindow;
    private windowOptions: Electron.BrowserWindowConstructorOptions;
    private viewPath: string;
    private windowService: WindowService;
    private static windowId: string = 'main';

    private static defaultOptions: Electron.BrowserWindowConstructorOptions = {
        width: 1024,
        height: 768,
        title: `Dreamers`,
        backgroundColor: '#1E1E1E',
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(path.dirname(require.main.filename), "preload.js")
        },
        show: false
    };

    constructor(windowOptions: Electron.BrowserWindowConstructorOptions, viewPath: string) {
        this.windowOptions = windowOptions;
        this.viewPath = viewPath;
        this.windowService = WindowService.getWindowService();
    }

    public getWindow(): BrowserWindow {
        if (!this.window) {
            this.createWindow(MainWindow.defaultOptions);
        }
        return this.window;
    }

    public setViewPath(newPath: string) {
        this.viewPath = newPath;
    }

    public loadView(): void {
        this.getWindow().loadFile(this.viewPath);
    }

    public createWindow(options: Electron.BrowserWindowConstructorOptions): void {
        this.window = new BrowserWindow({ ...options, ...this.windowOptions });
        this.subscribeForReadyToShow();
    }

    public getDefaultOptions() {
        return MainWindow.defaultOptions;
    }

    public destroyWindow() {
        this.getWindow().destroy();
    }

    public getWindowId() {
        return MainWindow.windowId;
    }

    private subscribeForReadyToShow(): void {
        this.getWindow().on('ready-to-show', () => {
            this.windowService.destroyBrowserWindow('splash');
            this.getWindow().show();
        });
    }
}