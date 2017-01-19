import { Component, ElementRef, EventEmitter, Output } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { HTMLElementChmod } from '../utils/HTMLElement';
import { PageCoordinates } from '../utils/PageCoordinates';
import { GlobalMouseDownListener } from '../utils/decorators';

@Component({
  selector: 'app-element-compositor',
  template: ``
})
export class ElementCompositorComponent extends BaseDomManipulationComponent {

  private static MANAGED_CSS_CLASS = 'archetype_managed';

  @Output()
  private onSelected = new EventEmitter<HTMLElement>();

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  @GlobalMouseDownListener()
  onMouseDown(event: MouseEvent) {
    if (this.isEventTargetInsideComponent(event.target) && !event.ctrlKey) {
      let target: HTMLElement = <HTMLElement> event.target;
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
    let [x, y] = this.toComponentCoordinates(coordinates);

    let element = HTMLElementChmod.fromTemplate(template)
      .setAbsoluteCoordinates(x, y)
      .addClass(ElementCompositorComponent.MANAGED_CSS_CLASS)
      .done();

    this.getNativeElement().appendChild(element);
    return element;
  }

}
