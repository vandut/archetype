import { Component, ElementRef, EventEmitter, Output, HostListener } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { HTMLElementChmod, HTMLElementFactory } from '../utils/HTMLElement';
import { PageCoordinates } from '../utils/PageCoordinates';

@Component({
  selector: 'app-element-compositor',
  template: ``
})
export class ElementCompositorComponent extends BaseDomManipulationComponent {

  private static MANAGED_CSS_CLASS = 'archetype_managed';

  @Output()
  public onSelected = new EventEmitter<HTMLElement>();

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  @HostListener('document:mousedown', ['$event'])
  public onMouseDown(event: MouseEvent) {
    if (this.isEventTargetInsideComponent(event.target) && !event.ctrlKey) {
      const target: HTMLElement = <HTMLElement> event.target;
      if (target.classList.contains(ElementCompositorComponent.MANAGED_CSS_CLASS)) {
        this.onSelected.emit(target);
      } else {
        this.onSelected.emit(null);
      }
      if (event.target !== this.getNativeElement()) {
        event.preventDefault();
      }
    }
  }

  addElement(template: string, coordinates: PageCoordinates): HTMLElement {
    const [x, y] = this.toComponentCoordinates(coordinates);

    const element = HTMLElementChmod.of(HTMLElementFactory.fromTemplate(template))
      .applyTransformation(t => {
        t.positionType = 'absolute';
        t.positionX = x;
        t.positionY = y;
      })
      .addClass(ElementCompositorComponent.MANAGED_CSS_CLASS)
      .done();

    this.getNativeElement().appendChild(element);
    return element;
  }

}
