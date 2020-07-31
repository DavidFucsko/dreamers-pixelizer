import { BrowserWindow } from 'electron';

export interface WindowInterface {
    getWindow(): BrowserWindow;
}