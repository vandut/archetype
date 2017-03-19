import { Injectable } from '@angular/core';
import { DragBaseService } from './drag-base.service';
import { HTMLElementTransformer } from '../shared/HTMLElement';

@Injectable()
export class DragResizeService extends DragBaseService {

  protected moveToSimple(target: HTMLElementTransformer, point: HammerPoint, data: any): HammerPoint {
    // TODO: not implemented
    return point;
  }

  protected moveToAdvanced(target: HTMLElementTransformer, point: HammerPoint, data: any): HammerPoint {
    const hostRect = this.parent.clientRect;

    let deltaX = point.x - this.lastXY.x;
    let deltaY = point.y - this.lastXY.y;

    const targetX = target.positionX;
    const targetY = target.positionY;
    const targetWidth = target.totalWidth;
    const targetHeight = target.totalHeight;

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
        target.positionY += deltaY;
        target.totalHeight -= deltaY;
        break;
      case 'Resize_S':
      case 'Resize_SW':
      case 'Resize_SE':
        target.totalHeight += deltaY;
        break;
    }

    switch (data) {
      case 'Resize_W':
      case 'Resize_NW':
      case 'Resize_SW':
        target.positionX += deltaX;
        target.totalWidth -= deltaX;
        break;
      case 'Resize_E':
      case 'Resize_NE':
      case 'Resize_SE':
        target.totalWidth += deltaX;
        break;
    }

    return {
      x: this.lastXY.x + deltaX,
      y: this.lastXY.y + deltaY
    };
  }

}
