import { ElementRef, Injectable } from '@angular/core';
import { DomHelper } from '../shared/DomHelper';
import { DraggableItem } from './DraggableItem';
import { Position2D, Position2DHelper } from '../shared/Position2D';
import { DraggableItemService } from './draggable-item.service';
import { DragEventListener } from './DragEventListener';
import { DragService } from './drag.service';

// TODO: Remove this class in favour of DragService and PreviewDirective
@Injectable()
export class PreviewService implements DragEventListener {

  private canvas: ElementRef;
  private draggableItem: DraggableItem = null;

  constructor(private draggableItemService: DraggableItemService,
              private dragService: DragService) {}

  public registerCanvas(canvas: ElementRef) {
    this.canvas = canvas;
  }

  public clearCanvas() {
    this.canvas = null;
  }

  private prepareDraggableItem(draggableItem: DraggableItem, position: Position2D): DraggableItem {
    const canvasDraggableItem = this.draggableItemService.getDraggableItem(DomHelper.getElement(this.canvas));
    draggableItem.makeChildOf(canvasDraggableItem);

    const parentPosition = Position2DHelper.toParentElementPosition2D(this.canvas, position);
    draggableItem.moveToPosition(parentPosition, null);

    return draggableItem;
  }

  public diffuseClick(event: MouseEvent) {
    this.dragService.diffuseClick(event);
  }

  public onTap(draggableItem: DraggableItem, position: Position2D) {
    this.dragService.onTap(draggableItem, position);
  }

  public onPanStart(draggableItem: DraggableItem, position: Position2D, resizeType?: string) {
    this.draggableItem = this.prepareDraggableItem(draggableItem, position);
    this.dragService.onPanStart(draggableItem, position, resizeType);
  }

  public onPanMove(position: Position2D) {
    if (Position2DHelper.isInsideParentElement(this.canvas, position)) {
      if (!this.draggableItem.isVisible()) {
        this.draggableItem.show();
      }
    } else {
      if (this.draggableItem.isVisible()) {
        this.draggableItem.hide();
      }
    }
    this.dragService.onPanMove(position);
  }

  public onPanEnd(position: Position2D) {
    this.dragService.onPanEnd(position);
    this.draggableItem.remove();
    this.draggableItem = null;
  }

  public onPanCancel(position: Position2D) {
    this.dragService.onPanCancel(position);
    this.draggableItem.remove();
    this.draggableItem = null;
  }

}
