import { Injectable } from '@angular/core';
import { DragBaseService } from './drag-base.service';
import { HTMLElementTransformer } from '../shared/HTMLElement';
import { Position2D } from '../shared/Position2D';

@Injectable()
export class DragMoveService extends DragBaseService {

  protected moveToSimple(target: HTMLElementTransformer, point: Position2D, data: any): Position2D {
    target.positionX += point.x - this.lastXY.x;
    target.positionY += point.y - this.lastXY.y;
    return point;
  }

  protected moveToAdvanced(target: HTMLElementTransformer, point: Position2D, data: any): Position2D {
    this.lastXY = this.moveToSimple(target, point, data);
    const adjustedLeft = Math.min(Math.max(0, target.positionX), this.parent.innerWidth - target.totalWidth);
    const adjustedTop = Math.min(Math.max(0, target.positionY), this.parent.innerHeight - target.totalHeight);
    const last = {
      x: this.lastXY.x + adjustedLeft - target.positionX,
      y: this.lastXY.y + adjustedTop - target.positionY
    };
    target.positionX = adjustedLeft;
    target.positionY = adjustedTop;
    return last;
  }

}
