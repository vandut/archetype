export class HTMLElementFactory {

  static fromTemplate(template: string): HTMLElement {
    let div = document.createElement('div');
    div.innerHTML = template;
    return <HTMLElement> div.firstChild;
  }

  static div(): HTMLDivElement {
    return document.createElement('div');
  }

}

export class HTMLElementChmod {

  private constructor(private element: HTMLElement) {}

  static of(element: HTMLElement): HTMLElementChmod {
    return new HTMLElementChmod(element);
  }

  static fromTemplate(template: string): HTMLElementChmod {
    return HTMLElementChmod.of(HTMLElementFactory.fromTemplate(template));
  }

  static fromDiv(): HTMLElementChmod {
    return HTMLElementChmod.of(HTMLElementFactory.div());
  }

  done(): HTMLElement {
    return this.element;
  }

  set left(x: number) {
    this.element.style.left = x + 'px';
  }

  set top(y: number) {
    this.element.style.top = y + 'px';
  }

  set right(x: number) {
    this.element.style.right = x + 'px';
  }

  set bottom(y: number) {
    this.element.style.bottom = y + 'px';
  }

  setCoordinates(x: number, y: number): HTMLElementChmod {
    this.left = x;
    this.top = y;
    return this;
  }

  setAbsoluteCoordinates(x: number, y: number): HTMLElementChmod {
    this.element.style.position = 'absolute';
    this.setCoordinates(x, y);
    return this;
  }

  set width(w: number) {
    this.element.style.width = w + 'px';
  }

  set height(h: number) {
    this.element.style.height = h + 'px';
  }

  setSize(w: number, h: number): HTMLElementChmod {
    this.width = w;
    this.height = h;
    return this;
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

  pointerEvents(status: boolean): HTMLElementChmod {
    this.element.style.pointerEvents = status ? 'auto' : 'none';
    return this;
  }

  customStyle(lambda: (style: CSSStyleDeclaration) => void): HTMLElementChmod {
    lambda(this.element.style);
    return this;
  }

  custom(lambda: (element: HTMLElementChmod) => void): HTMLElementChmod {
    lambda(this);
    return this;
  }

}
