export abstract class RendererBaseClass {
    private static viewPath: string;
    abstract render(): void;
    static getViewPath() {
        return this.viewPath;
    }
}
