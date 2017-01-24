import { Component, ElementRef, HostListener } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { HTMLElementChmod, HTMLElementFactory, HTMLElementTransformer } from '../utils/HTMLElement';
import { PageCoordinates } from '../utils/PageCoordinates';
import { DragDetail, DragEventNames } from '../services/drag.service';
import { ElementPaletteComponent } from './element-palette.component';

class DraggableElement {

  private draggedElement: HTMLElement;

  constructor(private template: string) {
    this.draggedElement = HTMLElementChmod.of(HTMLElementFactory.fromTemplate(template))
      .positionOnTop()
      .setOpacity(0.25)
      .addClass('cursor_grabbing')
      .done();
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
    const transformer = HTMLElementTransformer.of(this.draggedElement);
    transformer.positionX = offsetX;
    transformer.positionY = offsetY;
  }

}

@Component({
  selector: 'app-element-preview',
  template: ``
})
export class ElementPreviewComponent extends BaseDomManipulationComponent {

  private static PADDING = 10;

  private draggableElement: DraggableElement = null;

  public static addPaddingToPageCoordinates(coordinates: PageCoordinates): PageCoordinates {
    return {
      pageX: coordinates.pageX - ElementPreviewComponent.PADDING,
      pageY: coordinates.pageY - ElementPreviewComponent.PADDING
    };
  }

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  @HostListener(DragEventNames.RECEIVE_BEGIN, ['$event.detail'])
  public onDragBegin(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      this.createPreview(detail.data, detail.cause);
    }
  }

  @HostListener(DragEventNames.RECEIVE_MOVE, ['$event.detail'])
  public onDragMove(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      const inside = this.isPageCoordinatesInsideParentComponent(detail.cause);
      const visible = this.draggableElement.isVisible();
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

  @HostListener(DragEventNames.RECEIVE_END, ['$event.detail'])
  public onDragEnd(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      this.removePreview();
    }
  }

  private createPreview(template: string, coordinates: PageCoordinates) {
    coordinates = ElementPreviewComponent.addPaddingToPageCoordinates(coordinates);
    const [x, y] = this.toParentElementCoordinates(coordinates);
    this.draggableElement = new DraggableElement(template);
    this.draggableElement.attach(this.getNativeParentElement());
    this.draggableElement.moveTo(x, y);
  }

  private showPreview() {
    this.draggableElement.show();
  }

  private movePreviewTo(coordinates: PageCoordinates) {
    coordinates = ElementPreviewComponent.addPaddingToPageCoordinates(coordinates);
    const [x, y] = this.toParentElementCoordinates(coordinates);
    this.draggableElement.moveTo(x, y);
  }

  private hidePreview() {
    this.draggableElement.hide();
  }

  private removePreview() {
    this.draggableElement.remove();
    this.draggableElement = null;
  }

}
