import { Component, ElementRef } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { HTMLElementChmod } from '../utils/HTMLElement';
import { PageCoordinates } from '../utils/PageCoordinates';
import { DragDetail, DragBeginListener, DragMoveListener, DragEndListener } from '../services/drag.service';
import { ElementPaletteComponent } from './element-palette.component';

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

  isVisible(): boolean {
    return !this.draggedElement.style.visibility;
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

  private static PADDING = 10;

  private draggableElement: DraggableElement = null;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  @DragBeginListener()
  private onDragBegin(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      this.createPreview(detail.data, detail.cause);
    }
  }

  @DragMoveListener()
  private onDragMove(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      let inside = this.isPageCoordinatesInsideParentComponent(detail.cause);
      let visible = this.draggableElement.isVisible();
      if (inside) {
        if (!visible) {
          this.showPreview();
        }
        this.movePreviewTo(detail.cause);
      } else {
        if (visible) {
          this.hidePreview();
        }
      }
    }
  }

  @DragEndListener()
  private onDragEnd(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      this.removePreview();
    }
  }

  private createPreview(template: string, coordinates: PageCoordinates) {
    coordinates = ElementPreviewComponent.addPaddingToPageCoordinates(coordinates);
    let [x, y] = this.toParentElementCoordinates(coordinates);
    this.draggableElement = new DraggableElement(template);
    this.draggableElement.attach(this.getNativeParentElement());
    this.draggableElement.moveTo(x, y);
  }

  private showPreview() {
    this.draggableElement.show();
  }

  movePreviewTo(coordinates: PageCoordinates) {
    coordinates = ElementPreviewComponent.addPaddingToPageCoordinates(coordinates);
    let [x, y] = this.toParentElementCoordinates(coordinates);
    this.draggableElement.moveTo(x, y);
  }

  private hidePreview() {
    this.draggableElement.hide();
  }

  private removePreview() {
    this.draggableElement.remove();
    this.draggableElement = null;
  }

  public static addPaddingToPageCoordinates(coordinates: PageCoordinates): PageCoordinates {
    return {
      pageX: coordinates.pageX - ElementPreviewComponent.PADDING,
      pageY: coordinates.pageY - ElementPreviewComponent.PADDING
    };
  }

}
