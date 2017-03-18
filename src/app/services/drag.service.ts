import { HTMLElementTransformer, HTMLElementChmod } from '../utils/HTMLElement';
import { Injectable } from '@angular/core';

export interface DragMoveEventListener {
  diffuseClick(event: MouseEvent);
  onTap(target: HTMLElement, point: HammerPoint, data: any);
  onPanStart(target: HTMLElement, point: HammerPoint, data: any);
  onPanMove(target: HTMLElement, point: HammerPoint, data: any);
  onPanEnd(target: HTMLElement, point: HammerPoint, data: any);
  onPanCancel(target: HTMLElement, point: HammerPoint, data: any);
}

@Injectable()
export abstract class DragBaseService implements DragMoveEventListener {

  public static DATA_ATTR_PARENT_FOR = 'dragParentFor';
  public static DATA_ATTR_CHILDREN_OF = 'dragChildrenOf';

  public static registerMoveListeners(target: HTMLElement, listener: DragMoveEventListener) {
    target.addEventListener('mousedown', event => listener.diffuseClick(event));
    const hammerTime = new Hammer(target);
    hammerTime.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });
    hammerTime.on('tap', event => listener.onTap(event.target, event.center, null));
    hammerTime.on('panstart', event => listener.onPanStart(event.target, event.center, null));
    hammerTime.on('panmove', event => listener.onPanMove(event.target, event.center, null));
    hammerTime.on('panend', event => listener.onPanEnd(event.target, event.center, null));
    hammerTime.on('pancancel', event => listener.onPanCancel(event.target, event.center, null));
  }

  protected firstXY: HammerPoint = null;
  protected lastXY: HammerPoint = null;
  protected parent: HTMLElementChmod = null;

  public diffuseClick(event: MouseEvent) {
    if (event.button === 0) {
      event.preventDefault();
    }
  }

  public onTap(target: HTMLElement, point: HammerPoint, data: any) {
  }

  public onPanStart(target: HTMLElement, point: HammerPoint, data: any) {
    this.firstXY = point;
    this.lastXY = point;
    this.parent = this.findParent(target);
  }

  public onPanMove(target: HTMLElement, point: HammerPoint, data: any) {
    this.lastXY = this.moveTo(target, point, data);
  }

  public onPanEnd(target: HTMLElement, point: HammerPoint, data: any) {
    this.moveTo(target, point, data);
    this.firstXY = null;
    this.lastXY = null;
    this.parent = null;
  }

  public onPanCancel(target: HTMLElement, point: HammerPoint, data: any) {
    this.moveTo(target, this.firstXY, data);
    this.firstXY = null;
    this.lastXY = null;
    this.parent = null;
  }

  private moveTo(target: HTMLElement, point: HammerPoint, data: any): HammerPoint {
    if (this.parent) {
      return this.moveToAdvanced(HTMLElementTransformer.of(target), point, data);
    } else {
      return this.moveToSimple(HTMLElementTransformer.of(target), point, data);
    }
  }

  protected abstract moveToSimple(target: HTMLElementTransformer, point: HammerPoint, data: any): HammerPoint;

  protected abstract moveToAdvanced(target: HTMLElementTransformer, point: HammerPoint, data: any): HammerPoint;

  private findParent(target: HTMLElement): HTMLElementChmod {
    if (target.dataset[DragMoveService.DATA_ATTR_CHILDREN_OF]) {
      let parent = target.parentElement;
      while (parent !== null) {
        if (parent.dataset[DragBaseService.DATA_ATTR_PARENT_FOR] === target.dataset[DragBaseService.DATA_ATTR_CHILDREN_OF]) {
          return HTMLElementChmod.of(parent);
        }
        parent = parent.parentElement;
      }
    }
    return null;
  }

}

@Injectable()
export class DragMoveService extends DragBaseService {

  protected moveToSimple(target: HTMLElementTransformer, point: HammerPoint, data: any): HammerPoint {
    target.positionX += point.x - this.lastXY.x;
    target.positionY += point.y - this.lastXY.y;
    return point;
  }

  protected moveToAdvanced(target: HTMLElementTransformer, point: HammerPoint, data: any): HammerPoint {
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

export class ForwardingDragMoveEventListener implements DragMoveEventListener {

  constructor(private dragBaseService: DragBaseService) {}

  public diffuseClick(event: MouseEvent) {
    this.dragBaseService.diffuseClick(event);
  }

  public onTap(target: HTMLElement, point: HammerPoint, data: any) {
    this.dragBaseService.onTap(target, point, data);
  }

  public onPanStart(target: HTMLElement, point: HammerPoint, data: any) {
    this.dragBaseService.onPanStart(target, point, data);
  }

  public onPanMove(target: HTMLElement, point: HammerPoint, data: any) {
    this.dragBaseService.onPanMove(target, point, data);
  }

  public onPanEnd(target: HTMLElement, point: HammerPoint, data: any) {
    this.dragBaseService.onPanEnd(target, point, data);
  }

  public onPanCancel(target: HTMLElement, point: HammerPoint, data: any) {
    this.dragBaseService.onPanCancel(target, point, data);
  }

}
