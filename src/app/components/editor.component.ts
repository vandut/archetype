import { Component, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { SnappingGridComponent } from './snapping-grid.component';
import { ElementCompositorComponent } from './element-compositor.component';
import { ElementSelectionComponent } from './element-selection.component';
import { PageCoordinates } from '../utils/PageCoordinates';
import { HTMLElementChmod, HTMLElementTransformer } from '../utils/HTMLElement';
import { DragDetail, DragEventNames } from '../services/drag.service';
import { ElementPreviewComponent } from './element-preview.component';
import { ElementPaletteComponent } from './element-palette.component';
import {
  SelectionActionType,
  ResizeDragMessage,
  MoveDragMessage,
  SelectionComponent,
  SelectionDragMessage
} from './selection.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {

  @Output()
  private elementSelected = new EventEmitter<HTMLElement>();

  @ViewChild(SnappingGridComponent)
  private snappingGrid: SnappingGridComponent;

  @ViewChild(ElementCompositorComponent)
  private elementCompositor: ElementCompositorComponent;

  @ViewChild(ElementSelectionComponent)
  private selectionLayer: ElementSelectionComponent;

  private operation: Operation<SelectionDragMessage> = null;

  @HostListener(DragEventNames.RECEIVE_BEGIN, ['$event.detail'])
  public onDragBegin(detail: DragDetail<any | SelectionDragMessage, MouseEvent>) {
    if (detail.source instanceof SelectionComponent) {
      if (detail.data instanceof ResizeDragMessage) {
        this.operation = new ResizeOperation(detail.data.target, this.elementCompositor.getNativeElement(), detail.cause);
      } else if (detail.data instanceof MoveDragMessage) {
        this.operation = new MoveOperation(detail.data.target, this.elementCompositor.getNativeElement(), detail.cause);
      }
    }
  }

  @HostListener(DragEventNames.RECEIVE_MOVE, ['$event.detail'])
  public onDragMove(detail: DragDetail<any | SelectionDragMessage, MouseEvent>) {
    if (detail.source instanceof SelectionComponent) {
      this.operation.apply(detail.data, detail.cause);
    }
  }

  @HostListener(DragEventNames.RECEIVE_END, ['$event.detail'])
  public onDragEnd(detail: DragDetail<any | SelectionDragMessage, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      this.addElement(detail.data, detail.cause);
    } else if (detail.source instanceof SelectionComponent) {
      this.operation.apply(detail.data, detail.cause);
      this.operation = null;
    }
  }

  private addElement(template: string, coordinates: PageCoordinates) {
    if (this.elementCompositor.isPageCoordinatesInsideComponent(coordinates)) {
      coordinates = ElementPreviewComponent.addPaddingToPageCoordinates(coordinates);
      const element = this.elementCompositor.addElement(template, coordinates);
      this.onElementSelected(element);
    }
  }

  public onElementSelected(element: HTMLElement) {
    if (element) {
      this.selectionLayer.selectTarget(element);
    } else {
      this.selectionLayer.clearSelection();
    }
    this.elementSelected.emit(element);
  }

}

abstract class Operation<Message extends SelectionDragMessage> {

  protected target: HTMLElementTransformer;
  protected host: HTMLElementChmod;

  constructor(targetEl: HTMLElement, hostEl: HTMLElement,
              protected lastCoordinates: PageCoordinates) {
    this.target = HTMLElementTransformer.of(targetEl);
    this.host = HTMLElementChmod.of(hostEl);
  }

  abstract apply(message: Message, event: MouseEvent);

}

class MoveOperation extends Operation<MoveDragMessage> {

  apply(message: MoveDragMessage, event: MouseEvent) {
    this.target.positionX += event.pageX - this.lastCoordinates.pageX;
    this.target.positionY += event.pageY - this.lastCoordinates.pageY;
    this.lastCoordinates = event;
    this.adjustForSize();
  }

  private adjustForSize() {
    const adjustedLeft = Math.min(Math.max(0, this.target.positionX), this.host.innerWidth - this.target.totalWidth);
    const adjustedTop = Math.min(Math.max(0, this.target.positionY), this.host.innerHeight - this.target.totalHeight);
    this.lastCoordinates = {
      pageX: this.lastCoordinates.pageX + adjustedLeft - this.target.positionX,
      pageY: this.lastCoordinates.pageY + adjustedTop - this.target.positionY
    };
    this.target.positionX = adjustedLeft;
    this.target.positionY = adjustedTop;
  }

}

class ResizeOperation extends Operation<ResizeDragMessage> {

  apply(message: ResizeDragMessage, event: MouseEvent) {
    const hostRect = this.host.clientRect;

    let deltaX = event.pageX - this.lastCoordinates.pageX;
    let deltaY = event.pageY - this.lastCoordinates.pageY;

    const targetX = this.target.positionX;
    const targetY = this.target.positionY;
    const targetWidth = this.target.totalWidth;
    const targetHeight = this.target.totalHeight;

    switch (message.action) {
      case SelectionActionType.Resize_W:
      case SelectionActionType.Resize_NW:
      case SelectionActionType.Resize_SW:
        deltaX = Math.max(0, targetX + deltaX) - targetX + Math.min(0, targetWidth - deltaX);
        break;
      case SelectionActionType.Resize_E:
      case SelectionActionType.Resize_NE:
      case SelectionActionType.Resize_SE:
        deltaX = Math.round(Math.min(hostRect.width, targetX + targetWidth + deltaX)
                 - (targetX + targetWidth)) - Math.min(0, targetWidth + deltaX);
        break;
    }

    switch (message.action) {
      case SelectionActionType.Resize_N:
      case SelectionActionType.Resize_NW:
      case SelectionActionType.Resize_NE:
        deltaY = Math.max(0, targetY + deltaY) - targetY + Math.min(0, targetHeight - deltaY);
        break;
      case SelectionActionType.Resize_S:
      case SelectionActionType.Resize_SW:
      case SelectionActionType.Resize_SE:
        deltaY = Math.round(Math.min(hostRect.height, targetY + targetHeight + deltaY)
                 - (targetY + targetHeight)) - Math.min(0, targetHeight + deltaY);
        break;
    }

    switch (message.action) {
      case SelectionActionType.Resize_N:
      case SelectionActionType.Resize_NW:
      case SelectionActionType.Resize_NE:
        this.target.positionY += deltaY;
        this.target.totalHeight -= deltaY;
        break;
      case SelectionActionType.Resize_S:
      case SelectionActionType.Resize_SW:
      case SelectionActionType.Resize_SE:
        this.target.totalHeight += deltaY;
        break;
    }

    switch (message.action) {
      case SelectionActionType.Resize_W:
      case SelectionActionType.Resize_NW:
      case SelectionActionType.Resize_SW:
        this.target.positionX += deltaX;
        this.target.totalWidth -= deltaX;
        break;
      case SelectionActionType.Resize_E:
      case SelectionActionType.Resize_NE:
      case SelectionActionType.Resize_SE:
        this.target.totalWidth += deltaX;
        break;
    }

    this.lastCoordinates = {
      pageX: this.lastCoordinates.pageX + deltaX,
      pageY: this.lastCoordinates.pageY + deltaY
    };
  }

}
