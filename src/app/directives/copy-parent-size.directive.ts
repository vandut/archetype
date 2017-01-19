import { Directive, AfterViewInit, ElementRef } from '@angular/core';
import { WindowResizeListener } from '../utils/decorators';

@Directive({
  selector: '[appCopyParentSize]'
})
export class CopyParentSizeDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.copyParentSize()
  }

  @WindowResizeListener()
  onResize() {
    this.copyParentSize()
  }

  private copyParentSize() {
    const domElement = this.elementRef.nativeElement;
    const parentElement = domElement.parentNode;

    domElement.width = parentElement.width | parentElement.clientWidth;
    domElement.height = parentElement.height | parentElement.clientHeight;
  }

}
