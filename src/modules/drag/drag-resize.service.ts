import { Injectable } from '@angular/core';
import { DragBaseService } from './drag-base.service';
import { Position2D } from '../shared/Position2D';

@Injectable()
export class DragResizeService extends DragBaseService {

  protected moveTo(point: Position2D, data: any): Position2D {
    if (!this.draggableItem.parent) {
      console.warn('Parent undefined');
      return point;
    }

    const hostRect = this.draggableItem.parent.clientRect;

    let deltaX = point.x - this.lastXY.x;
    let deltaY = point.y - this.lastXY.y;

    const targetX = this.draggableItem.transformer.positionX;
    const targetY = this.draggableItem.transformer.positionY;
    const targetWidth = this.draggableItem.transformer.totalWidth;
    const targetHeight = this.draggableItem.transformer.totalHeight;

    switch (data) {
      case 'Resize_W':
      case 'Resize_NW':
      case 'Resize_SW':
        deltaX = Math.max(0, targetX + deltaX) - targetX + Math.min(0, targetWidth - deltaX);
        break;
      case 'Resize_E':
      case 'Resize_NE':
      case 'Resize_SE':
        deltaX = Math.round(Math.min(hostRect.width, targetX + targetWidth + deltaX)
            - (targetX + targetWidth)) - Math.min(0, targetWidth + deltaX);
        break;
    }

    switch (data) {
      case 'Resize_N':
      case 'Resize_NW':
      case 'Resize_NE':
        deltaY = Math.max(0, targetY + deltaY) - targetY + Math.min(0, targetHeight - deltaY);
        break;
      case 'Resize_S':
      case 'Resize_SW':
      case 'Resize_SE':
        deltaY = Math.round(Math.min(hostRect.height, targetY + targetHeight + deltaY)
            - (targetY + targetHeight)) - Math.min(0, targetHeight + deltaY);
        break;
    }

    switch (data) {
      case 'Resize_N':
      case 'Resize_NW':
      case 'Resize_NE':
        this.draggableItem.transformer.positionY += deltaY;
        this.draggableItem.transformer.totalHeight -= deltaY;
        break;
      case 'Resize_S':
      case 'Resize_SW':
      case 'Resize_SE':
        this.draggableItem.transformer.totalHeight += deltaY;
        break;
    }

    switch (data) {
      case 'Resize_W':
      case 'Resize_NW':
      case 'Resize_SW':
        this.draggableItem.transformer.positionX += deltaX;
        this.draggableItem.transformer.totalWidth -= deltaX;
        break;
      case 'Resize_E':
      case 'Resize_NE':
      case 'Resize_SE':
        this.draggableItem.transformer.totalWidth += deltaX;
        break;
    }

    return {
      x: this.lastXY.x + deltaX,
      y: this.lastXY.y + deltaY
    };
  }

}
