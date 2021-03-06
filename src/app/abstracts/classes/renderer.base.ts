import * as path from "path";

export abstract class RendererBaseClass {
    public static viewPath: string;
    public static dirName: string;

    abstract render(): void;

    public static getViewPath() {
        return path.join(this.dirName, this.viewPath);
    }
}
