import { DragEventListener } from './DragEventListener';
import { Position2D } from '../shared/Position2D';
import { DraggableItem } from './DraggableItem';
import { Injectable } from '@angular/core';

@Injectable()
export class DragService implements DragEventListener {

  protected firstXY: Position2D = null;
  protected lastXY: Position2D = null;
  protected draggableItem: DraggableItem = null;
  protected resizeType?: string = null;

  public diffuseClick(event: MouseEvent) {
    if (event.button === 0) {
      event.preventDefault();
    }
  }

  public onTap(draggableItem: DraggableItem, position: Position2D) {
  }

  public onPanStart(draggableItem: DraggableItem, position: Position2D, resizeType?: string) {
    this.firstXY = position;
    this.lastXY = position;
    this.draggableItem = draggableItem;
    this.resizeType = resizeType;
  }

  public onPanMove(position: Position2D) {
    this.lastXY = this.moveTo(position);
  }

  public onPanEnd(position: Position2D) {
    this.moveTo(position);
    this.firstXY = null;
    this.lastXY = null;
    this.draggableItem = null;
  }

  public onPanCancel(position: Position2D) {
    this.moveTo(this.firstXY);
    this.firstXY = null;
    this.lastXY = null;
    this.draggableItem = null;
  }

  protected moveTo(position: Position2D): Position2D {
    if (this.resizeType) {
      return this.draggableItem.moveWallTo(position, this.lastXY, this.resizeType);
    } else {
      return this.draggableItem.moveToPosition(position, this.lastXY);
    }
  }

}
