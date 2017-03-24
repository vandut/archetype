import { Injectable } from '@angular/core';
import { DragBaseService } from './drag-base.service';
import { Position2D } from '../shared/Position2D';

@Injectable()
export class DragMoveService extends DragBaseService {

  protected moveTo(point: Position2D, data: any): Position2D {
    if (this.draggableItem.parent) {
      return this.moveWithParentRestrictions(point);
    } else {
      return this.moveFreely(point);
    }
  }

  private moveFreely(point: Position2D): Position2D {
    this.draggableItem.transformer.positionX += point.x - this.lastXY.x;
    this.draggableItem.transformer.positionY += point.y - this.lastXY.y;
    return point;
  }

  private moveWithParentRestrictions(point: Position2D): Position2D {
    this.lastXY = this.moveFreely(point);
    const adjustedLeft = Math.min(Math.max(0, this.draggableItem.transformer.positionX), this.draggableItem.parent.innerWidth - this.draggableItem.transformer.totalWidth);
    const adjustedTop = Math.min(Math.max(0, this.draggableItem.transformer.positionY), this.draggableItem.parent.innerHeight - this.draggableItem.transformer.totalHeight);
    const last = {
      x: this.lastXY.x + adjustedLeft - this.draggableItem.transformer.positionX,
      y: this.lastXY.y + adjustedTop - this.draggableItem.transformer.positionY
    };
    this.draggableItem.transformer.positionX = adjustedLeft;
    this.draggableItem.transformer.positionY = adjustedTop;
    return last;
  }

}
