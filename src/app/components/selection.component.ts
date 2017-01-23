import { Component, Input } from '@angular/core';
import { HTMLElementTransformer } from '../utils/HTMLElement';
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

  private _target: HTMLElement;
  private transformer: HTMLElementTransformer;

  @Input()
  private set target(element: HTMLElement) {
    this._target = element;
    this.transformer = HTMLElementTransformer.of(element);
  }

  constructor(private dragService: DragService) {}

  private onMouseDownActionMove(event: MouseEvent): boolean {
    if (event.button == 0) {
      let message = new MoveDragMessage(this._target, SelectionActionType.Move);
      this.dragService.beginDrag(this, message, event);
      return false;
    }
  }

  private onMouseDownActionResize(type: string, event: MouseEvent): boolean {
    if (event.button == 0) {
      let message = new ResizeDragMessage(this._target, SelectionActionType[type]);
      this.dragService.beginDrag(this, message, event);
      return false;
    }
  }

}
