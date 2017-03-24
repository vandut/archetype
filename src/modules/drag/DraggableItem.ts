import { HTMLElementChmod, HTMLElementTransformer } from '../shared/HTMLElement';
import { ElementRepositoryHelper } from '../app/services/element-repository.service';

export interface DraggableItem {

  getDraggableParent(): DraggableItem;

}

export class DraggableItemImpl implements DraggableItem {

  public parent: HTMLElementChmod;
  public transformer: HTMLElementTransformer;

  constructor(public target: HTMLElement) {
    this.parent = DraggableItemImpl.findParent(target);
    this.transformer = HTMLElementTransformer.of(target);
  }

  getDraggableParent(): DraggableItem {
    throw new Error("Not Implemented!");
  }

  public static findParent(target: HTMLElement): HTMLElementChmod {
    if (ElementRepositoryHelper.getIsChildOf(target)) {
      let parent = target.parentElement;
      while (parent !== null) {
        if (ElementRepositoryHelper.getIsParentFor(parent) === ElementRepositoryHelper.getIsChildOf(target)) {
          return HTMLElementChmod.of(parent);
        }
        parent = parent.parentElement;
      }
    }
    return null;
  }

}
