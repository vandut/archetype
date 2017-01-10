import { Component, ElementRef, HostListener } from '@angular/core';
import { HTMLElementWrapper } from "./HTMLElementWrapper"

@Component({
  selector: 'app-drag-preview-inject',
  template: ``
})
export class DragPreviewInjectComponent {

  private template = '<div style="width: 100px; height: 100px; background: red;">A</div>';
  private draggedElement: HTMLElementWrapper = undefined;
  private mouseInsideFlag: boolean = false;
  private dragActiveFlag: boolean = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (this.isPartOfParent(event)) {
      this.onMouseDownInside(event);
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.isPartOfParent(event)) {
      this.onMouseUpInside(event);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isPartOfParent(event)) {
      if (!this.mouseInsideFlag) {
        this.mouseInsideFlag = true;
        this.onMouseEntered(event);
      } else {
        this.onMouseMoveInside(event);
      }
    } else {
      if (this.mouseInsideFlag) {
        this.mouseInsideFlag = false;
        this.onMouseLeft(event);
      }
    }
  }

  private onMouseDownInside(event: MouseEvent) {
    this.spawnElement();
    this.moveElementTo(event);
    this.dragActiveFlag = true;
    event.preventDefault();
  }

  private onMouseUpInside(event: MouseEvent) {
    this.dragActiveFlag = false;
    this.destroyElement();
    event.preventDefault();
  }

  private onMouseEntered(event: MouseEvent) {
    if (this.dragActiveFlag) {
      this.spawnElement();
      this.moveElementTo(event);
      event.preventDefault();
    }
  }

  private onMouseLeft(event: MouseEvent) {
    if (this.dragActiveFlag) {
      this.destroyElement();
      event.preventDefault();
    }
  }

  private onMouseMoveInside(event: MouseEvent) {
    if (this.dragActiveFlag) {
      this.moveElementTo(event);
      event.preventDefault();
    }
  }

  private moveElementTo(event: MouseEvent) {
    let pos = this.calculateMousePositionRelativeToParent(event);
    this.draggedElement.moveTo(pos[0] - this.draggedElement.getWidth()/2, pos[1] - this.draggedElement.getHeight()/2);
  }

  private calculateMousePositionRelativeToParent(event: MouseEvent): [number, number] {
    let x = event.offsetX;
    let y = event.offsetY;
    for (let node: HTMLElement = <HTMLElement> event.target;
          node != this.getParent();
          node = <HTMLElement> node.offsetParent) {
      x += node.offsetLeft;
      y += node.offsetTop;
    }
    return [x, y];
  }

  private getParent(): HTMLElement {
    return this.elementRef.nativeElement.parentNode;
  }

  private isPartOfParent(event: MouseEvent): boolean {
    return this.getParent().contains(<Node> event.target);
  }

  private spawnElement() {
    this.draggedElement = this.createElement();
    this.draggedElement.appendAsChildOf(this.getParent());
  }

  private destroyElement() {
    this.draggedElement.remove();
    this.draggedElement = undefined;
  }

  private createElement(): HTMLElementWrapper {
    let el = HTMLElementWrapper.fromTemplate(this.template)
    el.positionOnTop();
    el.setOpacity(0.25);
    el.addClass('cursor_grabbing');
    return el;
  }

  private isDraggedElementPresent(): boolean {
    return this.draggedElement !== undefined;
  }

}
