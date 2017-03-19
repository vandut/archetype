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
    this.recalculatePositionAfterTypeChange(this.element.style.position, p);
    this.element.style.position = p;
  }

  get positionX(): number {
    return this.element.offsetLeft;
  }

  set positionX(x: number) {
    if (x) {
      this.element.style.left = x + 'px';
    } else {
      this.element.style.left = null;
    }
  }

  get positionY(): number {
    return this.element.offsetTop;
  }

  set positionY(y: number) {
    if (y) {
      this.element.style.top = y + 'px';
    } else {
      this.element.style.top = null;
    }
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

  private recalculatePositionAfterTypeChange(from: string, to: string) {
    if (to === 'static') {
      this.positionX = null;
      this.positionY = null;
    } else if (to === 'absolute') {
      this.positionX = 0;
      this.positionY = 0;
    }
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
