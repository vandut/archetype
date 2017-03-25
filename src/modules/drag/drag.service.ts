import { DragEventListener } from './DragEventListener';
import { Position2D } from '../shared/Position2D';
import { DraggableItemImpl } from './DraggableItem';
import { Injectable } from '@angular/core';

abstract class DragBaseService implements DragEventListener {

  protected firstXY: Position2D = null;
  protected lastXY: Position2D = null;
  protected draggableItem: DraggableItemImpl = null;
  protected moveType: string = null;

  public diffuseClick(event: MouseEvent) {
    if (event.button === 0) {
      event.preventDefault();
    }
  }

  public onTap(draggableItem: DraggableItemImpl, point: Position2D, data: any) {
  }

  public onPanStart(draggableItem: DraggableItemImpl, point: Position2D, data: any) {
    this.firstXY = point;
    this.lastXY = point;
    this.draggableItem = draggableItem;
    this.moveType = data;
  }

  public onPanMove(point: Position2D) {
    this.lastXY = this.moveTo(point);
  }

  public onPanEnd(point: Position2D) {
    this.moveTo(point);
    this.firstXY = null;
    this.lastXY = null;
    this.draggableItem = null;
  }

  public onPanCancel(point: Position2D) {
    this.moveTo(this.firstXY);
    this.firstXY = null;
    this.lastXY = null;
    this.draggableItem = null;
  }

  protected abstract moveTo(point: Position2D): Position2D;

}

@Injectable()
export class DragMoveService extends DragBaseService {

  protected moveTo(position: Position2D): Position2D {
    return this.draggableItem.moveToPosition(position, this.lastXY);
  }

}

@Injectable()
export class DragResizeService extends DragBaseService {

  protected moveTo(position: Position2D): Position2D {
    return this.draggableItem.moveWallTo(position, this.lastXY, this.moveType);
  }

}
