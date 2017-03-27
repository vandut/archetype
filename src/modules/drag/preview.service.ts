import { ElementRef, Injectable } from '@angular/core';
import { DomHelper } from '../shared/DomHelper';
import { DraggableItem } from './DraggableItem';
import { Position2D, Position2DHelper } from '../shared/Position2D';
import { DraggableItemService } from './draggable-item.service';
import { DragEventListener } from './DragEventListener';

// TODO: Remove this class in favour of DragService and PreviewDirective
@Injectable()
export class PreviewService implements DragEventListener {

  private canvas: ElementRef;
  private draggableItem: DraggableItem = null;

  constructor(private draggableItemService: DraggableItemService) {}

  public registerCanvas(canvas: ElementRef) {
    this.canvas = canvas;
  }

  public clearCanvas() {
    this.canvas = null;
  }

  public diffuseClick(event: MouseEvent) {
    if (event.button === 0) {
      event.preventDefault();
    }
  }

  public onTap(draggableItem: DraggableItem, position: Position2D) {
  }

  public onPanStart(draggableItem: DraggableItem, position: Position2D, resizeType?: string) {
    const canvasDraggableItem = this.draggableItemService.getDraggableItem(DomHelper.getElement(this.canvas));
    draggableItem.makeChildOf(canvasDraggableItem);
    this.draggableItem = draggableItem;
    this.onPanMove(position);
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
    position = Position2DHelper.toParentElementPosition2D(this.canvas, position);
    this.draggableItem.moveToPosition(position, null);
  }

  public onPanEnd(position: Position2D) {
    this.draggableItem.remove();
    this.draggableItem = null;
  }

  public onPanCancel(position: Position2D) {
    this.draggableItem.remove();
    this.draggableItem = null;
  }

}
