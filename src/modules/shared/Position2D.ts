import { ElementRef } from '@angular/core';
import { DomHelper } from './DomHelper';

export interface Position2D {
  x: number;
  y: number;
}

export class Position2DHelper {

  public static isInsideElement(elementRef: ElementRef, position: Position2D): boolean {
    const rect = DomHelper.getElement(elementRef).getBoundingClientRect();
    return Position2DHelper.isInsideClientRect(rect, position);
  }

  public static toElementPosition(elementRef: ElementRef, position: Position2D): Position2D {
    const rect = DomHelper.getElement(elementRef).getBoundingClientRect();
    return {
      x: position.x - rect.left,
      y: position.y - rect.top
    };
  }

  public static toParentElementPosition(elementRef: ElementRef, position: Position2D): Position2D {
    const rect = DomHelper.getParentElement(elementRef).getBoundingClientRect();
    return {
      x: position.x - rect.left,
      y: position.y - rect.top
    };
  }

  public static isInsideParentElement(elementRef: ElementRef, position: Position2D): boolean {
    const rect = DomHelper.getParentElement(elementRef).getBoundingClientRect();
    return Position2DHelper.isInsideClientRect(rect, position);
  }

  public static isInsideClientRect(rect: ClientRect, position: Position2D): boolean {
    return position.x >= rect.left && position.x <= rect.right
      && position.y >= rect.top && position.y <= rect.bottom;
  }

}
