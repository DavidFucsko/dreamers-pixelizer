import { Menu, MenuItem, BrowserWindow, app } from 'electron';
import { openFileDialog } from '../../common/handlers/file-open.handler';
import { FileOpenResponse } from '../../common/responses/file-open-response.interface';

const isMac = process.platform === 'darwin'

const template = [
    // { role: 'appMenu'}
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'about' as const },
            { type: 'separator' as const },
            { role: 'services' as const },
            { type: 'separator' as const },
            { role: 'hide' as const },
            { role: 'unhide' as const },
            { type: 'separator' as const },
            { role: 'quit' as const }
        ]
    }] : []),
    // { role: 'fileMenu'}
    {
        label: 'File',
        submenu: [
            {
                label: 'Open Image',
                accelerator: 'CommandOrControl+N',
                click(item: MenuItem, focusedWindow: BrowserWindow) {
                    openFileDialog().then((result: FileOpenResponse) => {
                        if (focusedWindow) focusedWindow.webContents.send('dreamers:show-image', result);
                    });
                }
            },
            { type: 'separator' as const },
            isMac ? { role: 'close' as const } : { role: 'quit' as const },
        ]
    },
    // { role: 'viewMenu' as const }
    {
        label: 'View',
        submenu: [
            { role: 'reload' as const },
            { role: 'forceReload' as const },
            { role: 'toggleDevTools' as const }
        ]
    },
    // { role: 'windowMenu' as const }
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' as const },
            { role: 'zoom' as const },
            ...(isMac ? [
                { type: 'separator' as const },
                { role: 'front' as const },
                { type: 'separator' as const },
                { role: 'window' as const }
            ] : [])
        ]
    }
];

export const menu = Menu.buildFromTemplate(template);
