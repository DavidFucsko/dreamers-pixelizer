import * as fs from 'fs';
import { dialog } from 'electron';
import { FileOpenResponse } from '../interfaces/file-open-response.interface';

export async function openFileDialog(): Promise<FileOpenResponse> {

    const fileSelect = await dialog.showOpenDialog({
        filters: [{ name: 'Images', extensions: ['png', 'jpg'] }]
    });

    const filePath = fileSelect.filePaths[0];
    const base64 = fs.readFileSync(filePath).toString('base64');

    return new Promise<FileOpenResponse>((resolve, reject) => {
        resolve({ 'path': filePath, 'file': base64 });
        reject(new Error('Could not open File'));
    });
}