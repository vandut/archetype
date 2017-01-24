export class HTMLElementFactory {

  static fromTemplate(template: string): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = template;
    return <HTMLElement> div.firstChild;
  }

  static div(): HTMLDivElement {
    return document.createElement('div');
  }

}

/**
 * Helper class for transforming HTMLElement. Takes into account all properties and abstracts
 * manipulating of both position and size regardless of anchoring type and other properties.
 */
export class HTMLElementTransformer {

  public static of(element: HTMLElement): HTMLElementTransformer {
    return new HTMLElementTransformer(element);
  }

  private constructor(private element: HTMLElement) {}

  get positionType(): string {
    return this.element.style.position;
  }

  set positionType(p: string) {
    this.element.style.position = p;
    // TODO: add transformation
  }

  get positionX(): number {
    return this.element.offsetLeft;
  }

  set positionX(x: number) {
    this.element.style.left = x + 'px';
  }

  get positionY(): number {
    return this.element.offsetTop;
  }

  set positionY(y: number) {
    this.element.style.top = y + 'px';
  }

  get totalWidth(): number {
    return this.element.offsetWidth;
  }

  set totalWidth(w: number) {
    this.element.style.width = w + 'px';
  }

  get totalHeight(): number {
    return this.element.offsetHeight;
  }

  set totalHeight(h: number) {
    this.element.style.height = h + 'px';
  }

  get proxy(): HTMLElementTransformer {
    return this;
  }

}

export class HTMLElementChmod {

  public static of(element: HTMLElement): HTMLElementChmod {
    return new HTMLElementChmod(element);
  }

  private constructor(private element: HTMLElement) {}

  done(): HTMLElement {
    return this.element;
  }

  applyTransformation(exec: (HTMLElementTransformer) => void): HTMLElementChmod {
    exec(HTMLElementTransformer.of(this.element));
    return this;
  }

  get innerWidth(): number {
    return this.element.clientWidth;
  }

  get innerHeight(): number {
    return this.element.clientHeight;
  }

  addClass(name: string): HTMLElementChmod {
    this.element.classList.add(name);
    return this;
  }

  positionOnTop(): HTMLElementChmod {
    this.element.style.position = 'absolute';
    this.element.style.zIndex = '9999';
    return this;
  }

  setOpacity(opacity: number): HTMLElementChmod {
    this.element.style.opacity = `${opacity}`;
    return this;
  }

  get clientRect(): ClientRect {
    return this.element.getBoundingClientRect();
  }

}
