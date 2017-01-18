import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HTMLElementChmod } from '../utils/HTMLElement';

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

  @Output()
  private dragStarted = new EventEmitter<SelectionMessage>();

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

  private onMouseDown(type: string): boolean {
    this.dragStarted.emit(new SelectionMessage(this.element.done(), SelectionActionType[type]));
    return false;
  }

}
