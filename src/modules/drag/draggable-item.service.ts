import { Injectable } from '@angular/core';
import { DraggableItem } from './DraggableItem';
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

  constructor(private dom: HTMLElement, private parent: DraggableItem) {
    this.chmod = HTMLElementChmod.of(dom);
    this.transformer = HTMLElementTransformer.of(dom);
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
    const transformer = this.transformer;

    if (lastPosition === null) {
      transformer.positionX = position.x;
      transformer.positionY = position.y;
      return null;
    }

    transformer.positionX += position.x - lastPosition.x;
    transformer.positionY += position.y - lastPosition.y;

    if (!this.parent) {
      return position;
    }

    const adjustedLeft = Math.min(Math.max(0, transformer.positionX), this.parent.getChmod().innerWidth - transformer.totalWidth);
    const adjustedTop = Math.min(Math.max(0, transformer.positionY), this.parent.getChmod().innerHeight - transformer.totalHeight);
    const last = {
      x: position.x + adjustedLeft - transformer.positionX,
      y: position.y + adjustedTop - transformer.positionY
    };
    transformer.positionX = adjustedLeft;
    transformer.positionY = adjustedTop;
    return last;
  }

  public moveWallTo(position: Position2D, lastPosition: Position2D, resizeType: string): Position2D {
    const transformer = this.transformer;

    if (!this.parent) {
      console.warn('Parent undefined');
      return position;
    }

    let deltaX = position.x - lastPosition.x;
    let deltaY = position.y - lastPosition.y;

    const targetX = transformer.positionX;
    const targetY = transformer.positionY;
    const targetWidth = transformer.totalWidth;
    const targetHeight = transformer.totalHeight;

    switch (resizeType) {
      case 'Resize_W':
      case 'Resize_NW':
      case 'Resize_SW':
        deltaX = Math.max(0, targetX + deltaX) - targetX + Math.min(0, targetWidth - deltaX);
        break;
      case 'Resize_E':
      case 'Resize_NE':
      case 'Resize_SE':
        deltaX = Math.round(Math.min(this.parent.getChmod().clientRect.width, targetX + targetWidth + deltaX)
            - (targetX + targetWidth)) - Math.min(0, targetWidth + deltaX);
        break;
    }

    switch (resizeType) {
      case 'Resize_N':
      case 'Resize_NW':
      case 'Resize_NE':
        deltaY = Math.max(0, targetY + deltaY) - targetY + Math.min(0, targetHeight - deltaY);
        break;
      case 'Resize_S':
      case 'Resize_SW':
      case 'Resize_SE':
        deltaY = Math.round(Math.min(this.parent.getChmod().clientRect.height, targetY + targetHeight + deltaY)
            - (targetY + targetHeight)) - Math.min(0, targetHeight + deltaY);
        break;
    }

    switch (resizeType) {
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

    switch (resizeType) {
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
