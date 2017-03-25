import { Injectable } from '@angular/core';
import { DragBaseService } from './drag-base.service';
import { Position2D } from '../shared/Position2D';

@Injectable()
export class DragResizeService extends DragBaseService {

  protected moveTo(position: Position2D): Position2D {
    return this.draggableItem.moveWallTo(position, this.lastXY, this.moveType);
  }

}
