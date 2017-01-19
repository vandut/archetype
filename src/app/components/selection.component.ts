import { Component, Input } from '@angular/core';
import { HTMLElementChmod } from '../utils/HTMLElement';
import { DragService } from '../services/drag.service';

export enum SelectionActionType {
  Move,
  Resize_N,
  Resize_S,
  Resize_W,
  Resize_E,
  Resize_NW,
  Resize_NE,
  Resize_SW,
  Resize_SE
}

export abstract class SelectionDragMessage {
  constructor(public target: HTMLElement,
              public action: SelectionActionType) {}
}

export class ResizeDragMessage extends SelectionDragMessage {}
export class MoveDragMessage extends SelectionDragMessage {}

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent {

  private element: HTMLElementChmod;

  @Input()
  private set target(e: HTMLElement) {
    this.element = HTMLElementChmod.of(e);
  }

  private get top() {
    return this.element.top;
  }

  private get left() {
    return this.element.left;
  }

  private get width() {
    return this.element.width;
  }

  private get height() {
    return this.element.height;
  }

  constructor(private dragService: DragService) {}

  private onMouseDownActionMove(event: MouseEvent): boolean {
    if (event.button == 0) {
      let message = new MoveDragMessage(this.element.done(), SelectionActionType.Move);
      this.dragService.beginDrag(this, message, event);
      return false;
    }
  }

  private onMouseDownActionResize(type: string, event: MouseEvent): boolean {
    if (event.button == 0) {
      let message = new ResizeDragMessage(this.element.done(), SelectionActionType[type]);
      this.dragService.beginDrag(this, message, event);
      return false;
    }
  }

}
