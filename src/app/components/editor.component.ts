import { Component, ViewChild } from '@angular/core';
import { SnappingGridComponent } from './snapping-grid.component';
import { ElementCompositorComponent } from './element-compositor.component';
import { ElementSelectionComponent } from './element-selection.component';
import { PageCoordinates } from '../utils/PageCoordinates';
import { HTMLElementChmod } from '../utils/HTMLElement';
import { DragDetail, DragBeginListener, DragMoveListener, DragEndListener } from '../services/drag.service';
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

  @ViewChild(SnappingGridComponent)
  private snappingGrid: SnappingGridComponent;

  @ViewChild(ElementCompositorComponent)
  private elementCompositor: ElementCompositorComponent;

  @ViewChild(ElementSelectionComponent)
  private selectionLayer: ElementSelectionComponent;

  private operation: Operation<SelectionDragMessage> = null;

  @DragBeginListener()
  private onDragBegin(detail: DragDetail<any | SelectionDragMessage, MouseEvent>) {
    if (detail.source instanceof SelectionComponent) {
      if (detail.data instanceof ResizeDragMessage) {
        this.operation = new ResizeOperation(detail.data.target, this.elementCompositor.getNativeElement(), detail.cause);
      } else if (detail.data instanceof MoveDragMessage) {
        this.operation = new MoveOperation(detail.data.target, this.elementCompositor.getNativeElement(), detail.cause);
      }
    }
  }

  @DragMoveListener()
  private onDragMove(detail: DragDetail<any | SelectionDragMessage, MouseEvent>) {
    if (detail.source instanceof SelectionComponent) {
      this.operation.apply(detail.data, detail.cause);
    }
  }

  @DragEndListener()
  private onDragEnd(detail: DragDetail<any | SelectionDragMessage, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      this.addElement(detail.data, detail.cause);
    } else if (detail.source instanceof SelectionComponent) {
      this.operation.apply(detail.data, detail.cause);
      this.operation = null;
    }
  }

  private addElement(template: string, coordinates: PageCoordinates) {
    coordinates = ElementPreviewComponent.addPaddingToPageCoordinates(coordinates);
    let element = this.elementCompositor.addElement(template, coordinates);
    this.selectionLayer.selectTarget(element);
  }

  private onElementSelected(element: HTMLElement) {
    if (element) {
      this.selectionLayer.selectTarget(element);
    } else {
      this.selectionLayer.clearSelection();
    }
  }

}

abstract class Operation<Message extends SelectionDragMessage> {

  protected target: HTMLElementChmod;
  protected host: HTMLElementChmod;

  constructor(targetEl: HTMLElement, hostEl: HTMLElement,
              protected lastCoordinates: PageCoordinates) {
    this.target = HTMLElementChmod.of(targetEl);
    this.host = HTMLElementChmod.of(hostEl);
  }

  abstract apply(message: Message, event: MouseEvent);

}

class MoveOperation extends Operation<MoveDragMessage> {

  apply(message: MoveDragMessage, event: MouseEvent) {
    this.target.left += event.pageX - this.lastCoordinates.pageX;
    this.target.top += event.pageY - this.lastCoordinates.pageY;
    this.lastCoordinates = event;
    this.adjustForSize();
  }

  private adjustForSize() {
    let adjustedLeft = Math.min(Math.max(0, this.target.left), this.host.width - this.target.width);
    let adjustedTop = Math.min(Math.max(0, this.target.top), this.host.height - this.target.height);
    this.lastCoordinates = {
      pageX: this.lastCoordinates.pageX + adjustedLeft - this.target.left,
      pageY: this.lastCoordinates.pageY + adjustedTop - this.target.top
    };
    this.target.left = adjustedLeft;
    this.target.top = adjustedTop;
  }

}

class ResizeOperation extends Operation<ResizeDragMessage> {

  apply(message: ResizeDragMessage, event: MouseEvent) {
    let hostRect = this.host.clientRect;

    let deltaX = event.pageX - this.lastCoordinates.pageX;
    let deltaY = event.pageY - this.lastCoordinates.pageY;

    switch (message.action) {
      case SelectionActionType.Resize_W:
      case SelectionActionType.Resize_NW:
      case SelectionActionType.Resize_SW:
        deltaX = Math.max(0, this.target.left + deltaX) - this.target.left + Math.min(0, this.target.width - deltaX);
        break;
      case SelectionActionType.Resize_E:
      case SelectionActionType.Resize_NE:
      case SelectionActionType.Resize_SE:
        deltaX = Math.round(Math.min(hostRect.width, this.target.left + this.target.width + deltaX) - (this.target.left + this.target.width)) - Math.min(0, this.target.width + deltaX);
        break;
    }

    switch (message.action) {
      case SelectionActionType.Resize_N:
      case SelectionActionType.Resize_NW:
      case SelectionActionType.Resize_NE:
        deltaY = Math.max(0, this.target.top + deltaY) - this.target.top + Math.min(0, this.target.height - deltaY);
        break;
      case SelectionActionType.Resize_S:
      case SelectionActionType.Resize_SW:
      case SelectionActionType.Resize_SE:
        deltaY = Math.round(Math.min(hostRect.height, this.target.top + this.target.height + deltaY) - (this.target.top + this.target.height)) - Math.min(0, this.target.height + deltaY);
        break;
    }

    switch (message.action) {
      case SelectionActionType.Resize_N:
      case SelectionActionType.Resize_NW:
      case SelectionActionType.Resize_NE:
        this.target.top += deltaY;
        this.target.height -= deltaY;
        break;
      case SelectionActionType.Resize_S:
      case SelectionActionType.Resize_SW:
      case SelectionActionType.Resize_SE:
        this.target.height += deltaY;
        break;
    }

    switch (message.action) {
      case SelectionActionType.Resize_W:
      case SelectionActionType.Resize_NW:
      case SelectionActionType.Resize_SW:
        this.target.left += deltaX;
        this.target.width -= deltaX;
        break;
      case SelectionActionType.Resize_E:
      case SelectionActionType.Resize_NE:
      case SelectionActionType.Resize_SE:
        this.target.width += deltaX;
        break;
    }

    this.lastCoordinates = {
      pageX: this.lastCoordinates.pageX + deltaX,
      pageY: this.lastCoordinates.pageY + deltaY
    };
  }

}
