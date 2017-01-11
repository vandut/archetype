export class HTMLElementWrapper {

    private constructor(private wrapperElement: HTMLElement) {}

    static fromTemplate(template: string): HTMLElementWrapper {
        var div = document.createElement('div');
        div.innerHTML = template;
        let element = <HTMLElement> div.firstChild;
        return new HTMLElementWrapper(element);
    }

    getWrappedElement(): HTMLElement {
        return this.wrapperElement;
    }

    appendAsChildOf(parent: Node) {
        parent.appendChild(this.wrapperElement);
    }

    getWidth(): number {
        return this.wrapperElement.clientWidth;
    }

    getHeight(): number {
        return this.wrapperElement.clientHeight;
    }

    remove() {
        this.wrapperElement.remove();
    }

    positionOnTop() {
        this.wrapperElement.style.position = 'absolute';
        this.wrapperElement.style.zIndex = '9999';
    }

    setAbsolutePosition(x: number, y: number) {
        this.wrapperElement.style.position = 'absolute';
        this.moveTo(x, y);
    }

    setOpacity(opacity: number) {
        this.wrapperElement.style.opacity = opacity + '';
    }

    addClass(name: string) {
        this.wrapperElement.classList.add(name);
    }

    moveTo(x: number, y: number) {
        this.wrapperElement.style.left = x + 'px';
        this.wrapperElement.style.top = y + 'px';
    }

    }

}
