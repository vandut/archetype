import { Injectable } from '@angular/core';
import { DraggableItem, DraggableItemImpl } from './DraggableItem';
import { HTMLElementFactory } from '../shared/HTMLElement';

@Injectable()
export class DraggableItemService {

  public createDraggableItemFromTemplate(template: string): DraggableItem {
    const target = HTMLElementFactory.fromTemplate(template);
    return this.getDraggableItem(target);
  }

  public getDraggableItem(target: HTMLElement | EventTarget): DraggableItem {
    return new DraggableItemImpl(<HTMLElement> target);
  }

}
