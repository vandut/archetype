import { Injectable } from '@angular/core';
import { DragBaseService } from './drag-base.service';
import { Position2D } from '../shared/Position2D';

@Injectable()
export class DragMoveService extends DragBaseService {

  protected moveTo(position: Position2D): Position2D {
    return this.draggableItem.moveToPosition(position, this.lastXY);
  }

}
