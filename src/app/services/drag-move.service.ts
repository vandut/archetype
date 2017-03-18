import { HTMLElementTransformer, HTMLElementChmod } from '../utils/HTMLElement';
import { Injectable } from '@angular/core';

export interface DragMoveEventListener {
  diffuseClick(event: MouseEvent);
  onTap(target: HTMLElement, point: HammerPoint);
  onPanStart(target: HTMLElement, point: HammerPoint);
  onPanMove(target: HTMLElement, point: HammerPoint);
  onPanEnd(target: HTMLElement, point: HammerPoint);
  onPanCancel(target: HTMLElement, point: HammerPoint);
}

@Injectable()
export class DragMoveService implements DragMoveEventListener {

  public static DATA_ATTR_PARENT_FOR = 'dragParentFor';
  public static DATA_ATTR_CHILDREN_OF = 'dragChildrenOf';

  public static registerMoveListeners(target: HTMLElement, listener: DragMoveEventListener) {
    target.addEventListener('mousedown', event => listener.diffuseClick(event));
    const hammerTime = new Hammer(target);
    hammerTime.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });
    hammerTime.on('tap', event => listener.onTap(event.target, event.center));
    hammerTime.on('panstart', event => listener.onPanStart(event.target, event.center));
    hammerTime.on('panmove', event => listener.onPanMove(event.target, event.center));
    hammerTime.on('panend', event => listener.onPanEnd(event.target, event.center));
    hammerTime.on('pancancel', event => listener.onPanCancel(event.target, event.center));
  }

  private firstXY: HammerPoint = null;
  private lastXY: HammerPoint = null;
  private parent: HTMLElementChmod = null;

  public diffuseClick(event: MouseEvent) {
    if (event.button === 0) {
      event.preventDefault();
    }
  }

  public onTap(target: HTMLElement, point: HammerPoint) {
  }

  public onPanStart(target: HTMLElement, point: HammerPoint) {
    this.firstXY = point;
    this.lastXY = point;
    this.parent = this.findParent(target);
  }

  public onPanMove(target: HTMLElement, point: HammerPoint) {
    this.lastXY = this.moveTo(target, point);
  }

  public onPanEnd(target: HTMLElement, point: HammerPoint) {
    this.moveTo(target, point);
    this.firstXY = null;
    this.lastXY = null;
    this.parent = null;
  }

  public onPanCancel(target: HTMLElement, point: HammerPoint) {
    this.moveTo(target, this.firstXY);
    this.firstXY = null;
    this.lastXY = null;
    this.parent = null;
  }

  private moveTo(target: HTMLElement, point: HammerPoint): HammerPoint {
    if (this.parent) {
      return this.moveToAdvanced(HTMLElementTransformer.of(target), point);
    } else {
      return this.moveToSimple(HTMLElementTransformer.of(target), point);
    }
  }

  private moveToSimple(target: HTMLElementTransformer, point: HammerPoint): HammerPoint {
    target.positionX += point.x - this.lastXY.x;
    target.positionY += point.y - this.lastXY.y;
    return point;
  }

  private moveToAdvanced(target: HTMLElementTransformer, point: HammerPoint): HammerPoint {
    this.lastXY = this.moveToSimple(target, point);
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

  private findParent(target: HTMLElement): HTMLElementChmod {
    if (target.dataset[DragMoveService.DATA_ATTR_CHILDREN_OF]) {
      let parent = target.parentElement;
      while (parent !== null) {
        if (parent.dataset[DragMoveService.DATA_ATTR_PARENT_FOR] === target.dataset[DragMoveService.DATA_ATTR_CHILDREN_OF]) {
          return HTMLElementChmod.of(parent);
        }
        parent = parent.parentElement;
      }
    }
    return null;
  }

}

export class ForwardingDragMoveEventListener implements DragMoveEventListener {

  constructor(private dragMoveService: DragMoveService) {}

  public diffuseClick(event: MouseEvent) {
    this.dragMoveService.diffuseClick(event);
  }

  public onTap(target: HTMLElement, point: HammerPoint) {
    this.dragMoveService.onTap(target, point);
  }

  public onPanStart(target: HTMLElement, point: HammerPoint) {
    this.dragMoveService.onPanStart(target, point);
  }

  public onPanMove(target: HTMLElement, point: HammerPoint) {
    this.dragMoveService.onPanMove(target, point);
  }

  public onPanEnd(target: HTMLElement, point: HammerPoint) {
    this.dragMoveService.onPanEnd(target, point);
  }

  public onPanCancel(target: HTMLElement, point: HammerPoint) {
    this.dragMoveService.onPanCancel(target, point);
  }

}
