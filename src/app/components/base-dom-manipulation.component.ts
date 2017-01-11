import { ElementRef } from '@angular/core';

export class BaseDomManipulationComponent {

  constructor(private elementRef: ElementRef) {}
  
  getNativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  isEventTargetInsideComponent(event: Event): boolean {
    return this.getNativeElement().contains(<Node> event.target);
  }

  isMouseEventInsideComponent(event: MouseEvent): boolean {
    let rect = this.getNativeElement().getBoundingClientRect();
    return event.pageX >= rect.left && event.pageX <= rect.right
        && event.pageY >= rect.top && event.pageY <= rect.bottom;
  }

  toComponentCoordinates(event: MouseEvent): [number, number] {
    let rect = this.getNativeElement().getBoundingClientRect();
    return [
      event.pageX - rect.left,
      event.pageY - rect.top
    ];
  }

}
