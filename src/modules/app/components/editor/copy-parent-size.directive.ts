import { Directive, AfterViewInit, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[copyParentSize]'
})
export class CopyParentSizeDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.copyParentSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.copyParentSize();
  }

  private copyParentSize() {
    const domElement = this.elementRef.nativeElement;
    const parentElement = domElement.parentNode;

    domElement.width = parentElement.width || parentElement.clientWidth;
    domElement.height = parentElement.height || parentElement.clientHeight;
  }

}
