import * as fs from 'fs';
import { dialog } from 'electron';

export async function openFileDialog(): Promise<{ 'path': string, 'file': string }> {
    const fileSelect = await dialog.showOpenDialog({
        filters: [{ name: 'Images', extensions: ['png', 'jpg'] }]
    });

    const filePath = fileSelect.filePaths[0];
    const base64 = fs.readFileSync(filePath).toString('base64');

    return new Promise<{ 'path': string, 'file': string }>((resolve, reject) => {
        resolve({ 'path': filePath, 'file': base64 });
        reject(new Error('Could not open File'));
    });
}