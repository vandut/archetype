import { HTMLElementChmod, HTMLElementTransformer } from '../shared/HTMLElement';
import { ElementRepositoryHelper } from '../app/services/element-repository.service';

export interface DraggableItem {

  getDraggableParent(): DraggableItem;

}

// TODO: make this class the only accessor of HTML DOM in Drag module
export class DraggableItemImpl implements DraggableItem {

  public parent: HTMLElementChmod;
  public transformer: HTMLElementTransformer;

  constructor(public target: HTMLElement) {
    this.parent = HTMLElementChmod.of(DraggableItemImpl.findParent(target));
    this.transformer = HTMLElementTransformer.of(target);
  }

  getDraggableParent(): DraggableItem {
    throw new Error("Not Implemented!");
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

}
