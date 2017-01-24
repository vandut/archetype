import { ElementRef } from '@angular/core';
import { PageCoordinates } from '../utils/PageCoordinates';

export class BaseDomManipulationComponent {

  constructor(private elementRef: ElementRef) {}

  getNativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  getNativeParentElement(): HTMLElement {
    return <HTMLElement> this.getNativeElement().parentNode;
  }

  isEventTargetInsideComponent(target: EventTarget): boolean {
    return this.getNativeElement().contains(<Node> target);
  }

  isEventTargetInsideParent(target: EventTarget): boolean {
    return this.getNativeParentElement().contains(<Node> target);
  }

  isPageCoordinatesInsideComponent(coordinates: PageCoordinates): boolean {
    const rect = this.getNativeElement().getBoundingClientRect();
    return this.isPageCoordinatesInsideClientRect(rect, coordinates);
  }

  isPageCoordinatesInsideParentComponent(coordinates: PageCoordinates): boolean {
    const rect = this.getNativeParentElement().getBoundingClientRect();
    return this.isPageCoordinatesInsideClientRect(rect, coordinates);
  }

  private isPageCoordinatesInsideClientRect(rect: ClientRect, coordinates: PageCoordinates): boolean {
    return coordinates.pageX >= rect.left && coordinates.pageX <= rect.right
      && coordinates.pageY >= rect.top && coordinates.pageY <= rect.bottom;
  }

  toComponentCoordinates(coordinates: PageCoordinates): [number, number] {
    const rect = this.getNativeElement().getBoundingClientRect();
    return [
      coordinates.pageX - rect.left,
      coordinates.pageY - rect.top
    ];
  }

  toParentElementCoordinates(coordinates: PageCoordinates): [number, number] {
    const rect = this.getNativeParentElement().getBoundingClientRect();
    return [
      coordinates.pageX - rect.left,
      coordinates.pageY - rect.top
    ];
  }

}
