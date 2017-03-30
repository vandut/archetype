import { Injectable } from '@angular/core';
import { DraggableItem, Sizer } from './DraggableItem';
import { HTMLElementChmod, HTMLElementFactory, HTMLElementTransformer } from '../shared/HTMLElement';
import { ElementRepositoryHelper } from '../app/services/element-repository.service';
import { Position2D } from '../shared/Position2D';

@Injectable()
export class DraggableItemService {

  public createDraggableItemFromTemplate(template: string): DraggableItem {
    const target = HTMLElementFactory.fromTemplate(template);
    return new DraggableItemImpl(target, null);
  }

  public getDraggableItem(target: HTMLElement | EventTarget): DraggableItem {
    const parentElement = this.findTargetParent(<HTMLElement> target);
    const parentItem = parentElement === null ? null : new DraggableItemImpl(parentElement, null);
    return new DraggableItemImpl(<HTMLElement> target, parentItem);
  }

  private findTargetParent(target: HTMLElement): HTMLElement {
    if (ElementRepositoryHelper.getIsChildOf(target)) {
      let parent = target.parentElement;
      while (parent !== null) {
        if (ElementRepositoryHelper.getIsParentFor(parent) === ElementRepositoryHelper.getIsChildOf(target)) {
          return parent;
        }
        parent = parent.parentElement;
      }
    }
    return null;
  }

}

class DraggableItemImpl implements DraggableItem {

  public static ATTR_NAME_DRAGGABLE = 'draggable';

  private chmod: HTMLElementChmod;
  private transformer: HTMLElementTransformer;
  public readonly sizer: Sizer;

  constructor(private dom: HTMLElement, private parent: DraggableItem) {
    this.chmod = HTMLElementChmod.of(dom);
    this.transformer = HTMLElementTransformer.of(dom);
    this.sizer = new SizerImpl(dom);
  }

  public getRootlessCopy(): DraggableItem {
    return new DraggableItemImpl(<HTMLElement> this.getDom().cloneNode(true), null);
  }

  public getDom(): HTMLElement {
    return this.dom;
  }

  public getParent(): DraggableItem {
    return this.parent;
  }

  public getChmod(): HTMLElementChmod {
    return this.chmod;
  }

  public getTransformer(): HTMLElementTransformer {
    return this.transformer;
  }

  public getData(key: string): string {
    return this.dom.dataset[key];
  }

  public enableDrag(){
    this.dom.dataset[DraggableItemImpl.ATTR_NAME_DRAGGABLE] = 'true';
  }

  public isDragEnabled(): boolean {
    return this.dom.dataset[DraggableItemImpl.ATTR_NAME_DRAGGABLE] === 'true';
  }

  public show()  {
    this.dom.style.visibility = null;
  }

  public hide()  {
    this.dom.style.visibility = 'hidden';
  }

  public isVisible(): boolean {
    return !this.dom.style.visibility;
  }

  public isMovable(): boolean {
    return this.transformer.positionType !== 'static';
  }

  public isResizable(): boolean {
    return getComputedStyle(this.dom).display === 'block';
  }

  public makeChildOf(draggableItem: DraggableItem) {
    draggableItem.getDom().appendChild(this.dom);
  }

  public remove() {
    this.dom.remove();
  }

  public moveToPosition(position: Position2D, lastPosition: Position2D): Position2D {
    if (lastPosition === null) {
      this.sizer.left = position.x;
      this.sizer.top = position.y;
      return null;
    }

    this.sizer.left += position.x - lastPosition.x;
    this.sizer.top += position.y - lastPosition.y;

    if (!this.parent) {
      return position;
    }

    const adjustedLeft = Math.min(Math.max(0, this.sizer.left), this.parent.getChmod().innerWidth - this.sizer.width);
    const adjustedTop = Math.min(Math.max(0, this.sizer.top), this.parent.getChmod().innerHeight - this.sizer.height);
    const last = {
      x: position.x + adjustedLeft - this.sizer.left,
      y: position.y + adjustedTop - this.sizer.top
    };
    this.sizer.left = adjustedLeft;
    this.sizer.top = adjustedTop;
    return last;
  }

  public moveWallTo(position: Position2D, lastPosition: Position2D, resizeType: string): Position2D {
    if (!this.parent) {
      console.warn('Parent undefined');
      return position;
    }

    let deltaX = position.x - lastPosition.x;
    let deltaY = position.y - lastPosition.y;

    switch (resizeType) {
      case 'Resize_W':
      case 'Resize_NW':
      case 'Resize_SW':
        deltaX = Math.max(0, this.sizer.left + deltaX) - this.sizer.left + Math.min(0, this.sizer.width - deltaX);
        break;
      case 'Resize_E':
      case 'Resize_NE':
      case 'Resize_SE':
        deltaX = Math.round(Math.min(this.parent.getChmod().clientRect.width, this.sizer.left + this.sizer.width + deltaX)
            - (this.sizer.left + this.sizer.width)) - Math.min(0, this.sizer.width + deltaX);
        break;
    }

    switch (resizeType) {
      case 'Resize_N':
      case 'Resize_NW':
      case 'Resize_NE':
        deltaY = Math.max(0, this.sizer.top + deltaY) - this.sizer.top + Math.min(0, this.sizer.height - deltaY);
        break;
      case 'Resize_S':
      case 'Resize_SW':
      case 'Resize_SE':
        deltaY = Math.round(Math.min(this.parent.getChmod().clientRect.height, this.sizer.top + this.sizer.height + deltaY)
            - (this.sizer.top + this.sizer.height)) - Math.min(0, this.sizer.height + deltaY);
        break;
    }

    switch (resizeType) {
      case 'Resize_N':
      case 'Resize_NW':
      case 'Resize_NE':
        this.sizer.top += deltaY;
        this.sizer.height -= deltaY;
        break;
      case 'Resize_S':
      case 'Resize_SW':
      case 'Resize_SE':
        this.sizer.height += deltaY;
        break;
    }

    switch (resizeType) {
      case 'Resize_W':
      case 'Resize_NW':
      case 'Resize_SW':
        this.sizer.left += deltaX;
        this.sizer.width -= deltaX;
        break;
      case 'Resize_E':
      case 'Resize_NE':
      case 'Resize_SE':
        this.sizer.width += deltaX;
        break;
    }

    return {
      x: lastPosition.x + deltaX,
      y: lastPosition.y + deltaY
    };
  }

}

/*
 * TODO: Add support for calculated styles:
 * border, margin, padding, size, positioning
 */
class SizerImpl implements Sizer {

  constructor(private dom: HTMLElement) {}

  get left(): number {
    return SizerImpl.stringPx(this.dom.style.left);//this.dom.offsetLeft;
  }

  set left(left: number) {
    if (left) {
      this.dom.style.left = left + 'px';
    } else {
      this.dom.style.left = null;
    }
  }

  get right(): number {
    return SizerImpl.stringPx(this.dom.style.right);//this.dom.offsetRight;
  }

  set right(right: number) {
    if (right) {
      this.dom.style.right = right + 'px';
    } else {
      this.dom.style.right = null;
    }
  }

  get top(): number {
    return SizerImpl.stringPx(this.dom.style.top);//this.dom.offsetTop;
  }

  set top(top: number) {
    if (top) {
      this.dom.style.top = top + 'px';
    } else {
      this.dom.style.top = null;
    }
  }

  get bottom(): number {
    return SizerImpl.stringPx(this.dom.style.bottom);//this.dom.offsetBottom;
  }

  set bottom(bottom: number) {
    if (bottom) {
      this.dom.style.bottom = bottom + 'px';
    } else {
      this.dom.style.bottom = null;
    }
  }

  get width(): number {
    return SizerImpl.stringPx(this.dom.style.width);//this.dom.offsetWidth;
  }

  set width(width: number) {
    this.dom.style.width = width + 'px';
  }

  get height(): number {
    return SizerImpl.stringPx(this.dom.style.height);//this.dom.offsetHeight;
  }

  set height(height: number) {
    this.dom.style.height = height + 'px';
  }

  private static stringPx(value: string): number {
    return Number(value.slice(0, -2));
  }

}
