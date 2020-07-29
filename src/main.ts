import { app, BrowserWindow, ipcMain } from 'electron';
import { IpcChannelInterface } from './electron/ipc/ipc-channel.interface';
import { FileOpenChannel } from './electron/ipc/file-open-channel';
import * as path from "path";

class Main {
  private mainWindow: BrowserWindow;

  public init(ipcChannels: IpcChannelInterface[]) {
    app.on('ready', this.createWindow);
    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);

    this.registerIpcChannels(ipcChannels);
  }

  private onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onActivate() {
    if (!this.mainWindow) {
      this.createWindow();
    }
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      title: `Dreamers`,
      webPreferences: {
        nodeIntegration: true, // makes it possible to use `require` within our index.html
        preload: path.join(__dirname, "preload.js"),
      }
    });

    this.mainWindow.webContents.openDevTools();
    this.mainWindow.loadFile('../index.html');
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach(channel => ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)));
  }
}

// Here we go!
(new Main()).init([new FileOpenChannel()]);