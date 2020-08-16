import { app, ipcMain, Menu } from 'electron';
import { WindowInterface } from './app/abstracts/interfaces/window.interface';
import { WindowService } from './app/services/window.service';
import { MainWindow } from './app/windows/main.window';
import { MainRenderer } from './app/views/renderers/main.renderer';
import { menu } from './app/static/menu.template';
import { SplashWindow } from './app/windows/splash.window';
import {
  IpcChannelInterface,
  FileOpenChannel,
  TemplateChangeChannel,
  PixelizeImageChannel,
  SaveFileChannel
} from './electron';

class Main {

  private windowService: WindowService;

  constructor() {
    this.windowService = WindowService.getWindowService();
  }

  public init(ipcChannels: IpcChannelInterface[], windows: WindowInterface[]) {
    app.on('ready', this.initializeView.bind(this, windows));
    app.on('window-all-closed', this.onWindowAllClosed);

    this.registerIpcChannels(ipcChannels);
  }

  private onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private initializeView(windowsToRegister: WindowInterface[]) {
    this.registerWindows(windowsToRegister);
    this.registerMenu();
  }

  private registerWindows(windowsToRegister: WindowInterface[]) {
    this.windowService.registerWindows(windowsToRegister);
    this.windowService.createBrowserWindows();
    this.windowService.loadViews();
  }

  private registerMenu() {
    Menu.setApplicationMenu(menu);
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach(channel => ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)));
  }
}

(new Main()).init(
  [
    new FileOpenChannel(),
    new TemplateChangeChannel(),
    new PixelizeImageChannel(),
    new SaveFileChannel()
  ],
  [
    new MainWindow({}, MainRenderer.getViewPath()),
    new SplashWindow('')
  ]);