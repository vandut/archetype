import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HTMLElementTransformer } from '../utils/HTMLElement';
import { LegacyDragService } from '../services/legacy-drag.service';
import { ForwardingDragMoveEventListener, DragMoveService } from '../services/drag-move.service';

export enum SelectionActionType {
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
export class SelectionComponent implements AfterViewInit {

  public _target: HTMLElement;

  public transformer: HTMLElementTransformer;

  @Input()
  public set target(element: HTMLElement) {
    this._target = element;
    this.transformer = HTMLElementTransformer.of(element);
  }

  @ViewChild('background')
  private background: ElementRef;

  constructor(private legacyDragService: LegacyDragService,
              private dragMoveService: DragMoveService) {}

  ngAfterViewInit() {
    DragMoveService.registerMoveListeners(this.background.nativeElement, new SelectionTargetDragMoveListener(this.dragMoveService, this));
  }

  public onMouseDownActionResize(type: string, event: MouseEvent): boolean {
    if (event.button === 0) {
      const message = new ResizeDragMessage(this._target, SelectionActionType[type]);
      this.legacyDragService.beginDrag(this, message, event);
      return false;
    }
  }

  public isMovable(): boolean {
    return this.transformer.positionType !== 'static';
  }

  public isResizable(): boolean {
    return getComputedStyle(this._target).display === 'block';
  }

}

class SelectionTargetDragMoveListener extends ForwardingDragMoveEventListener {

  constructor(dragMoveService: DragMoveService, private selectionComponent: SelectionComponent) {
    super(dragMoveService);
  }

  public onTap(target: HTMLElement, point: HammerPoint) {
    super.onTap(this.selectionComponent._target, point);
  }

  public onPanStart(target: HTMLElement, point: HammerPoint) {
    super.onPanStart(this.selectionComponent._target, point);
  }

  public onPanMove(target: HTMLElement, point: HammerPoint) {
    super.onPanMove(this.selectionComponent._target, point);
  }

  public onPanEnd(target: HTMLElement, point: HammerPoint) {
    super.onPanEnd(this.selectionComponent._target, point);
  }

  public onPanCancel(target: HTMLElement, point: HammerPoint) {
    super.onPanCancel(this.selectionComponent._target, point);
  }

}
