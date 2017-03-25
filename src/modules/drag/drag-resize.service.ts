import { Injectable } from '@angular/core';
import { DragBaseService } from './drag-base.service';
import { Position2D } from '../shared/Position2D';

@Injectable()
export class DragResizeService extends DragBaseService {

  protected moveTo(point: Position2D): Position2D {
    const transformer = this.draggableItem.transformer;
    const parentChmod = this.draggableItem.parentChmod;
    const lastPosition = this.lastXY;
    const moveType = this.moveType;

    if (!parentChmod) {
      console.warn('Parent undefined');
      return point;
    }

    let deltaX = point.x - lastPosition.x;
    let deltaY = point.y - lastPosition.y;

    const targetX = transformer.positionX;
    const targetY = transformer.positionY;
    const targetWidth = transformer.totalWidth;
    const targetHeight = transformer.totalHeight;

    switch (moveType) {
      case 'Resize_W':
      case 'Resize_NW':
      case 'Resize_SW':
        deltaX = Math.max(0, targetX + deltaX) - targetX + Math.min(0, targetWidth - deltaX);
        break;
      case 'Resize_E':
      case 'Resize_NE':
      case 'Resize_SE':
        deltaX = Math.round(Math.min(parentChmod.clientRect.width, targetX + targetWidth + deltaX)
            - (targetX + targetWidth)) - Math.min(0, targetWidth + deltaX);
        break;
    }

    switch (moveType) {
      case 'Resize_N':
      case 'Resize_NW':
      case 'Resize_NE':
        deltaY = Math.max(0, targetY + deltaY) - targetY + Math.min(0, targetHeight - deltaY);
        break;
      case 'Resize_S':
      case 'Resize_SW':
      case 'Resize_SE':
        deltaY = Math.round(Math.min(parentChmod.clientRect.height, targetY + targetHeight + deltaY)
            - (targetY + targetHeight)) - Math.min(0, targetHeight + deltaY);
        break;
    }

    switch (moveType) {
      case 'Resize_N':
      case 'Resize_NW':
      case 'Resize_NE':
        transformer.positionY += deltaY;
        transformer.totalHeight -= deltaY;
        break;
      case 'Resize_S':
      case 'Resize_SW':
      case 'Resize_SE':
        transformer.totalHeight += deltaY;
        break;
    }

    switch (moveType) {
      case 'Resize_W':
      case 'Resize_NW':
      case 'Resize_SW':
        transformer.positionX += deltaX;
        transformer.totalWidth -= deltaX;
        break;
      case 'Resize_E':
      case 'Resize_NE':
      case 'Resize_SE':
        transformer.totalWidth += deltaX;
        break;
    }

    return {
      x: lastPosition.x + deltaX,
      y: lastPosition.y + deltaY
    };
  }

}
