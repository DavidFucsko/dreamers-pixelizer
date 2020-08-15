import { dialog } from "electron";

export async function saveFileDialog(): Promise<{ filePath: string }> {
    const fileSelect = await dialog.showSaveDialog({
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
    });

    return new Promise<{ filePath: string }>((resolve, reject) => {
        if (fileSelect.canceled) {
            reject(new Error('Save Canceled'));
        }
        resolve({ filePath: fileSelect.filePath });
    });
}