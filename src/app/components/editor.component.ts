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
    if (this.isPageCoordinatesInside(detail.cause) && detail.source instanceof SelectionComponent) {
      this.operation.apply(detail.data, detail.cause);
    }
  }

  @DragEndListener()
  private onDragEnd(detail: DragDetail<any | SelectionDragMessage, MouseEvent>) {
    if (this.isPageCoordinatesInside(detail.cause)) {
      if (detail.source instanceof ElementPaletteComponent) {
        this.addElement(detail.data, detail.cause);
      } else if (detail.source instanceof SelectionComponent) {
        this.operation.apply(detail.data, detail.cause);
        this.operation = null;
      }
    }
  }

  private isPageCoordinatesInside(coordinates: PageCoordinates): boolean {
    return this.elementCompositor.isPageCoordinatesInsideComponent(coordinates);
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

  private get rect(): ClientRect {
    return this.target.clientRect;
  }

  private get hostRect(): ClientRect {
    return this.host.clientRect;
  }

  private set left(l: number) {
    if (this.target.width + this.target.left - l >= 0) {
      this.target.width = this.target.width + this.target.left - l;
      this.target.left = l;
    }
  }

  private set top(t: number) {
    if (this.target.height + this.target.top - t >= 0) {
      this.target.height = this.target.height + this.target.top - t;
      this.target.top = t;
    }
  }

  private set width(w: number) {
    this.target.width = w;
  }

  private set height(h: number) {
    this.target.height = h;
  }

  apply(message: ResizeDragMessage, event: MouseEvent) {
    let l = event.pageX - this.hostRect.left;
    let t = event.pageY - this.hostRect.top;
    let w = event.pageX - this.rect.left;
    let h = event.pageY - this.rect.top;

    switch (message.action) {
      case SelectionActionType.Resize_N:
        this.top = t;
        break;
      case SelectionActionType.Resize_S:
        this.height = h;
        break;
      case SelectionActionType.Resize_W:
        this.left = l;
        break;
      case SelectionActionType.Resize_E:
        this.width = w;
        break;
      case SelectionActionType.Resize_NW:
        this.top = t;
        this.left = l;
        break;
      case SelectionActionType.Resize_NE:
        this.top = t;
        this.width = w;
        break;
      case SelectionActionType.Resize_SW:
        this.height = h;
        this.left = l;
        break;
      case SelectionActionType.Resize_SE:
        this.height = h;
        this.width = w;
        break;
      default:
        return;
    }
  }

}
