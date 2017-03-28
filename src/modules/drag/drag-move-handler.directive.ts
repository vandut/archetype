import { Directive, HostListener } from '@angular/core';
import { DragService } from './drag.service';
import { HammerSupport } from './HammerSupport';
import { DraggableItemService } from './draggable-item.service';
import { DraggableItem } from './DraggableItem';

@Directive({
  selector: '[dragMoveHandler]'
})
export class DragMoveHandlerDirective {

  public static registerAsDraggable(draggableItem: DraggableItem) {
    draggableItem.enableDrag();
    HammerSupport.registerEventDelegator(draggableItem)
  }

  constructor(private dragService: DragService, private draggableItemService: DraggableItemService) {}

  @HostListener('mousedown-delegate', ['$event'])
  public diffuseClick(event: CustomEvent) {
    const draggableItem = this.draggableItemService.getDraggableItem(event.target);
    if (this.isAllowed(draggableItem)) {
      this.dragService.diffuseClick(event.detail);
    }
  }

  @HostListener('tap-delegate', ['$event'])
  public onTap(event: CustomEvent) {
    const draggableItem = this.draggableItemService.getDraggableItem(event.target);
    if (this.isAllowed(draggableItem)) {
      this.dragService.onTap(draggableItem, event.detail.center);
    }
  }

  @HostListener('panstart-delegate', ['$event'])
  public onPanStart(event: CustomEvent) {
    const draggableItem = this.draggableItemService.getDraggableItem(event.target);
    if (this.isAllowed(draggableItem)) {
      this.dragService.onPanStart(draggableItem, event.detail.center);
    }
  }

  @HostListener('panmove-delegate', ['$event'])
  public onPanMove(event: CustomEvent) {
    const draggableItem = this.draggableItemService.getDraggableItem(event.target);
    if (this.isAllowed(draggableItem)) {
      this.dragService.onPanMove(event.detail.center);
    }
  }

  @HostListener('panend-delegate', ['$event'])
  public onPanEnd(event: CustomEvent) {
    const draggableItem = this.draggableItemService.getDraggableItem(event.target);
    if (this.isAllowed(draggableItem)) {
      this.dragService.onPanEnd(event.detail.center);
    }
  }

  @HostListener('pancancel-delegate', ['$event'])
  public onPanCancel(event: CustomEvent) {
    const draggableItem = this.draggableItemService.getDraggableItem(event.target);
    if (this.isAllowed(draggableItem)) {
      this.dragService.onPanCancel(event.detail.center);
    }
  }

  private isAllowed(draggableItem: DraggableItem) {
    return draggableItem.isDragEnabled() && draggableItem.isMovable();
  }

}
