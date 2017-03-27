import { PageCoordinates } from './PageCoordinates';
import { ElementRef } from '@angular/core';
import { DomHelper } from './DomHelper';
import { Position2D } from './Position2D';

export class PageCoordinatesHelper {

  public static isInsideElement(elementRef: ElementRef, coordinates: PageCoordinates): boolean {
    const rect = DomHelper.getElement(elementRef).getBoundingClientRect();
    return PageCoordinatesHelper.isInsideClientRect(rect, coordinates);
  }

  public static isInsideClientRect(rect: ClientRect, coordinates: PageCoordinates): boolean {
    return coordinates.pageX >= rect.left && coordinates.pageX <= rect.right
      && coordinates.pageY >= rect.top && coordinates.pageY <= rect.bottom;
  }

  public static toElementCoordinates(elementRef: ElementRef, coordinates: PageCoordinates): [number, number] {
    const rect = DomHelper.getElement(elementRef).getBoundingClientRect();
    return [
      coordinates.pageX - rect.left,
      coordinates.pageY - rect.top
    ];
  }

  public static fromPosition2D(position: Position2D): PageCoordinates {
    return {
      pageX: position.x,
      pageY: position.y
    };
  }

}
