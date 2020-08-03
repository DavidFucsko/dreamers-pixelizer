import { app, ipcMain } from 'electron';
import { IpcChannelInterface } from './electron/ipc/ipc-channel.interface';
import { FileOpenChannel } from './electron/channels/file-open-channel';
import { WindowInterface } from './app/abstracts/interfaces/window.interface';
import { WindowService } from './app/services/window.service';
import { MainWindow } from './app/windows/main.window';
import { MainRenderer } from './app/views/renderers/main.renderer';

class Main {
  private registeredWindows: WindowInterface[];
  private windowService: WindowService;

  constructor() {
    this.windowService = new WindowService();
  }

  public init(ipcChannels: IpcChannelInterface[], windowsToRegister: WindowInterface[]) {
    app.on('ready', this.registerWindows.bind(this, windowsToRegister));
    app.on('window-all-closed', this.onWindowAllClosed);

    this.registerIpcChannels(ipcChannels);
  }

  private onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private registerWindows(windowsToRegister: WindowInterface[]) {
    this.windowService.registerWindows(windowsToRegister);
    this.registeredWindows = this.windowService.getWindows();
    this.windowService.createWindows();
    this.windowService.loadViews();
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach(channel => ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)));
  }
}

// Here we go!
(new Main()).init([new FileOpenChannel()], [new MainWindow({}, MainRenderer.getViewPath())]);