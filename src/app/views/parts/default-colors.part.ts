export class DefaulColors {
    public static colorizeShell() {
        const shellBackground = '#1E1E1E';
        const shellForeground = '#CCCCCC';
        const style = document.createElement('style');
        style.className = 'initialShellColors';
        document.head.appendChild(style);
        style.innerHTML = `body { background-color: ${shellBackground}; color: ${shellForeground}; margin: 0; padding: 0; }`;
    }
}