import { Component, ElementRef } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { HTMLElementChmod } from '../utils/HTMLElement';
import { PageCoordinates } from '../utils/PageCoordinates';

class DraggableElement {

  private draggedElement: HTMLElement;

  constructor(private template: string) {
    this.draggedElement = HTMLElementChmod.fromTemplate(template)
      .positionOnTop()
      .setOpacity(0.25)
      .addClass('cursor_grabbing')
      .done();
  }

  getTemplate(): string {
    return this.template;
  }

  attach(parent: Node) {
    parent.appendChild(this.draggedElement);
  }

  remove() {
    this.draggedElement.remove();
  }

  show() {
    this.draggedElement.style.visibility = null;
  }

  hide() {
    this.draggedElement.style.visibility = 'hidden';
  }

  moveTo(offsetX: number, offsetY: number) {
    HTMLElementChmod.of(this.draggedElement).setCoordinates(offsetX, offsetY);
  }

}

@Component({
  selector: 'app-element-preview',
  template: ``
})
export class ElementPreviewComponent extends BaseDomManipulationComponent {

  private draggableElement: DraggableElement = null;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  isPreviewActive(): boolean {
    return !!this.draggableElement;
  }

  getPreviewTemplate(): string {
    if (this.isPreviewActive()) {
      return this.draggableElement.getTemplate();
    } else {
      return null;
    }
  }

  createPreview(template: string, coordinates: PageCoordinates) {
    if (!this.isPreviewActive()) {
      let [x, y] = this.toParentElementCoordinates(coordinates);
      this.draggableElement = new DraggableElement(template);
      this.draggableElement.attach(this.getNativeParentElement());
      this.draggableElement.moveTo(x, y);
    }
  }

  showPreview() {
    if (this.isPreviewActive()) {
      this.draggableElement.show();
    }
  }

  movePreviewTo(coordinates: PageCoordinates) {
    if (this.isPreviewActive()) {
      let [x, y] = this.toParentElementCoordinates(coordinates);
      this.draggableElement.moveTo(x, y);
    }
  }

  hidePreview() {
    if (this.isPreviewActive()) {
      this.draggableElement.hide();
    }
  }

  removePreview() {
    if (this.isPreviewActive()) {
      this.draggableElement.remove();
      this.draggableElement = null;
    }
  }

}
