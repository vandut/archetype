export class HTMLElementWrapper {

    private constructor(private wrapperElement: HTMLElement) {}

    static fromTemplate(template: string): HTMLElementWrapper {
        let div = document.createElement('div');
        div.innerHTML = template;
        let element = <HTMLElement> div.firstChild;
        return new HTMLElementWrapper(element);
    }

    static fromDiv(): HTMLElementWrapper {
        let div = document.createElement('div');
        return new HTMLElementWrapper(div);
    }

    public get style() { return this.wrapperElement.style; }

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
        this.style.position = 'absolute';
        this.style.zIndex = '9999';
    }

    setAbsolutePosition(x: number, y: number) {
        this.style.position = 'absolute';
        this.moveTo(x, y);
    }

    setSize(w: number, h: number) {
        this.style.width = w + 'px';
        this.style.height = h + 'px';
    }

    setOpacity(opacity: number) {
        this.style.opacity = opacity + '';
    }

    addClass(name: string) {
        this.wrapperElement.classList.add(name);
    }

    moveTo(x: number, y: number) {
        this.style.left = x + 'px';
        this.style.top = y + 'px';
    }

}
