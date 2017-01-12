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

  setPosition(x: number, y: number): HTMLElementChmod {
    this.element.style.left = x + 'px';
    this.element.style.top = y + 'px';
    return this;
  }

  setAbsolutePosition(x: number, y: number): HTMLElementChmod {
    this.element.style.position = 'absolute';
    this.setPosition(x, y);
    return this;
  }

  setSize(w: number, h: number): HTMLElementChmod {
    this.element.style.width = w + 'px';
    this.element.style.height = h + 'px';
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
    this.element.style.opacity = opacity + '';
    return this;
  }

  customStyle(lambda: (style: CSSStyleDeclaration) => void): HTMLElementChmod{
    lambda(this.element.style);
    return this;
  }

}
