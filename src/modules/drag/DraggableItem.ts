import { HTMLElementChmod, HTMLElementTransformer } from '../shared/HTMLElement';
import { ElementRepositoryHelper } from '../app/services/element-repository.service';
import { Position2D } from '../shared/Position2D';

export interface DraggableItem {

  getRootlessCopy(): DraggableItem;

  getDom(): HTMLElement;
  getParent(): DraggableItem;
  getChmod(): HTMLElementChmod;
  getTransformer(): HTMLElementTransformer;

  enableDrag();
  isDragEnabled(): boolean;

  show();
  hide();
  isVisible(): boolean;

  makeChildOf(draggableItem: DraggableItem);
  remove();

  moveToPosition(position: Position2D, lastPosition: Position2D): Position2D;
  moveWallTo(position: Position2D, lastPosition: Position2D, resizeType: string): Position2D;

}

export class DraggableItemImpl implements DraggableItem {

  public static ATTR_NAME_DRAGGABLE = 'draggable';

  private parent: DraggableItem = null;
  private chmod: HTMLElementChmod;
  private transformer: HTMLElementTransformer;

  constructor(private target: HTMLElement) {
    const parentElement = DraggableItemImpl.findParent(target);
    if (parentElement) {
      this.parent = new DraggableItemImpl(parentElement);
    }

    this.chmod = HTMLElementChmod.of(target);
    this.transformer = HTMLElementTransformer.of(target);
  }

  public getRootlessCopy(): DraggableItem {
    return new DraggableItemImpl(<HTMLElement> this.getDom().cloneNode(true));
  }

  public getDom(): HTMLElement {
    return this.target;
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

  private static findParent(target: HTMLElement): HTMLElement {
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

  public enableDrag(){
    this.target.dataset[DraggableItemImpl.ATTR_NAME_DRAGGABLE] = 'true';
  }

  public isDragEnabled(): boolean {
    return this.target.dataset[DraggableItemImpl.ATTR_NAME_DRAGGABLE] === 'true';
  }

  public show()  {
    this.target.style.visibility = null;
  }

  public hide()  {
    this.target.style.visibility = 'hidden';
  }

  public isVisible(): boolean {
    return !this.target.style.visibility;
  }

  public makeChildOf(draggableItem: DraggableItem) {
    draggableItem.getDom().appendChild(this.target);
  }

  public remove() {
    this.target.remove();
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
