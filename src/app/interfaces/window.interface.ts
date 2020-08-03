import { BrowserWindow } from 'electron';
import { RendererInterface } from './renderer.interface';

export interface WindowInterface {
    getWindow(): BrowserWindow;
    registerRenderer(renderer: RendererInterface): void;
    renderWindowView(): void;
}