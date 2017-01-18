import { Component, Input } from '@angular/core';
import { HTMLElementChmod } from '../utils/HTMLElement';
import { DragService, DragDetail } from '../services/drag.service';

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

export class SelectionMessage {
  constructor(public target: HTMLElement,
              public action: SelectionActionType) {}
}

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

  private onMouseDown(type: string, event: MouseEvent): boolean {
    let message = new SelectionMessage(this.element.done(), SelectionActionType[type]);
    this.dragService.beginDrag(new DragDetail(this, message, event));
    return false;
  }

}
