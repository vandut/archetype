import { HTMLElementChmod, HTMLElementTransformer } from '../shared/HTMLElement';
import { ElementRepositoryHelper } from '../app/services/element-repository.service';
import { Position2D } from '../shared/Position2D';

export interface DraggableItem {

  getDraggableParent(): DraggableItem;
  getChmod(): HTMLElementChmod;

}

// TODO: make this class the only accessor of HTML DOM in Drag module
export class DraggableItemImpl implements DraggableItem {

  private chmod: HTMLElementChmod;
  public parentChmod: HTMLElementChmod;
  public transformer: HTMLElementTransformer;

  constructor(public target: HTMLElement) {
    this.chmod = HTMLElementChmod.of(target);
    this.parentChmod = HTMLElementChmod.of(DraggableItemImpl.findParent(target));
    this.transformer = HTMLElementTransformer.of(target);
  }

  getDraggableParent(): DraggableItem {
    throw new Error("Not Implemented!");
  }

  getChmod(): HTMLElementChmod {
    return this.chmod;
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

  public moveToPosition(position: Position2D, lastPosition: Position2D): Position2D {
    const transformer = this.transformer;
    const parentChmod = this.parentChmod;

    transformer.positionX += position.x - lastPosition.x;
    transformer.positionY += position.y - lastPosition.y;

    if (!parentChmod) {
      return position;
    }

    const adjustedLeft = Math.min(Math.max(0, transformer.positionX), parentChmod.innerWidth - transformer.totalWidth);
    const adjustedTop = Math.min(Math.max(0, transformer.positionY), parentChmod.innerHeight - transformer.totalHeight);
    const last = {
      x: position.x + adjustedLeft - transformer.positionX,
      y: position.y + adjustedTop - transformer.positionY
    };
    transformer.positionX = adjustedLeft;
    transformer.positionY = adjustedTop;
    return last;
  }

}
