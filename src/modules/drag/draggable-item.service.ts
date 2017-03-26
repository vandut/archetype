import { Injectable } from '@angular/core';
import { DraggableItem, DraggableItemImpl } from './DraggableItem';

@Injectable()
export class DraggableItemService {

  public getDraggableItem(target: HTMLElement | EventTarget): DraggableItem {
    return new DraggableItemImpl(<HTMLElement> target);
  }

  public getPreviewOf(target: HTMLElement | EventTarget, previewContainer: HTMLElement): DraggableItem {
    const clone = <HTMLElement> (<HTMLElement> target).cloneNode(true);
    const draggableItem = new DraggableItemImpl(clone);
    draggableItem.getChmod()
      .positionOnTop()
      .setOpacity(0.25)
      .addClass('cursor_grabbing');
    draggableItem.makeChildOf(this.getDraggableItem(previewContainer));
    return draggableItem;
  }

}
