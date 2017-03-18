import { Component, ViewChild, HostListener } from '@angular/core';
import { ElementCompositorComponent } from './element-compositor.component';
import { PageCoordinates } from '../utils/PageCoordinates';
import { HTMLElementChmod, HTMLElementTransformer } from '../utils/HTMLElement';
import { DragDetail, DragEventNames } from '../services/legacy-drag.service';
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

  @ViewChild(ElementCompositorComponent)
  private elementCompositor: ElementCompositorComponent;

  private operation: Operation<SelectionDragMessage> = null;

  constructor() {}

  @HostListener(DragEventNames.RECEIVE_BEGIN, ['$event.detail'])
  public onDragBegin(detail: DragDetail<any | SelectionDragMessage, MouseEvent>) {
    if (detail.source instanceof SelectionComponent || detail.source instanceof ElementCompositorComponent) {
      if (detail.data instanceof ResizeDragMessage) {
        this.operation = new ResizeOperation(detail.data.target, this.elementCompositor.getNativeElement(), detail.cause);
      }
    }
  }

  @HostListener(DragEventNames.RECEIVE_MOVE, ['$event.detail'])
  public onDragMove(detail: DragDetail<any | SelectionDragMessage, MouseEvent>) {
    if (detail.source instanceof SelectionComponent || detail.source instanceof ElementCompositorComponent) {
      this.operation.apply(detail.data, detail.cause);
    }
  }

  @HostListener(DragEventNames.RECEIVE_END, ['$event.detail'])
  public onDragEnd(detail: DragDetail<any | SelectionDragMessage, MouseEvent>) {
    if (detail.source instanceof SelectionComponent || detail.source instanceof ElementCompositorComponent) {
      this.operation.apply(detail.data, detail.cause);
      this.operation = null;
    }
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
