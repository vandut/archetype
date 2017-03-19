import { ElementRef } from '@angular/core';

export class DomHelper {

  public static getElement(elementRef: ElementRef): HTMLElement {
    return <HTMLElement> elementRef.nativeElement;
  }

  public static getParentElement(elementRef: ElementRef): HTMLElement {
    return DomHelper.getElement(elementRef).parentElement;
  }

}
