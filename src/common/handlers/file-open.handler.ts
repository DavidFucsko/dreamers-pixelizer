import * as fs from 'fs';
import { dialog } from 'electron';
import { FileOpenResponse } from '../responses/file-open-response.interface';

export async function openFileDialog(): Promise<FileOpenResponse> {

    const fileSelect = await dialog.showOpenDialog({
        filters: [{ name: 'Images', extensions: ['png', 'jpg'] }]
    });

    return openFileByPath(fileSelect.filePaths[0]);
}

export function openFileByPath(filePath: string): Promise<FileOpenResponse> {
    return new Promise<FileOpenResponse>((resolve, reject) => {
        if (!!filePath) {
            const base64 = fs.readFileSync(filePath).toString('base64');
            resolve({ 'path': filePath, 'file': base64 });
        }
        reject(new Error('Could not open File'));
    });
}