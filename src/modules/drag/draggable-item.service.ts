import { Injectable } from '@angular/core';
import { DraggableItem, DraggableItemImpl } from './DraggableItem';

@Injectable()
export class DraggableItemService {

  public getDraggableItem(target: HTMLElement | EventTarget): DraggableItem {
    return new DraggableItemImpl(<HTMLElement> target);
  }

  public copyDraggableItem(target: HTMLElement | EventTarget): DraggableItem {
    const clone = <HTMLElement> (<HTMLElement> target).cloneNode(true);
    return new DraggableItemImpl(clone);
  }

}
