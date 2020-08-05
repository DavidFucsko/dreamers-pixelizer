import { Menu, MenuItem, BrowserWindow, app } from 'electron';

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
                    console.log(focusedWindow);
                    if (focusedWindow) focusedWindow.webContents.send('dreamers:open-file');
                }
            },
            { type: 'separator' as const },
            isMac ? { role: 'close' as const } : { role: 'quit' as const },
        ]
    },
    // { role: 'editMenu' }
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' as const },
            { role: 'redo' as const },
            { type: 'separator' as const },
            { role: 'cut' as const },
            { role: 'copy' as const },
            { role: 'paste' as const },
            ...(isMac ? [
                { role: 'pasteAndMatchStyle' as const },
                { role: 'delete' as const },
                { role: 'selectAll' as const },
                { type: 'separator' as const },
            ] : [
                    { role: 'delete' as const },
                    { type: 'separator' as const },
                    { role: 'selectAll' as const }
                ])
        ]
    },
    // { role: 'viewMenu' as const }
    {
        label: 'View',
        submenu: [
            { role: 'reload' as const },
            { role: 'forceReload' as const },
            { role: 'toggleDevTools' as const },
            { type: 'separator' as const },
            { role: 'resetZoom' as const },
            { role: 'zoomIn' as const },
            { role: 'zoomOut' as const },
            { type: 'separator' as const },
            { role: 'togglefullscreen' as const }
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
            ] : [
                    { role: 'close' as const }
                ])
        ]
    },
    {
        role: 'help' as const,
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://electronjs.org')
                }
            }
        ]
    }
];

export const menu = Menu.buildFromTemplate(template);
