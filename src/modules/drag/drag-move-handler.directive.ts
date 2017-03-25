import { Directive, HostListener } from '@angular/core';
import { DragService } from './drag.service';
import { HammerSupport } from './HammerSupport';
import { DraggableItemImpl } from './DraggableItem';

@Directive({
  selector: '[dragMoveHandler]'
})
export class DragMoveHandlerDirective {

  public static ATTR_NAME_DRAGGABLE = 'draggable';

  public static registerAsDraggable(target: HTMLElement) {
    target.dataset[DragMoveHandlerDirective.ATTR_NAME_DRAGGABLE] = 'true';
    HammerSupport.registerEventDelegator(target)
  }

  constructor(private dragService: DragService) {}

  @HostListener('mousedown-delegate', ['$event'])
  public diffuseClick(event: CustomEvent) {
    if (DragMoveHandlerDirective.canHandleDragMove(event.target)) {
      this.dragService.diffuseClick(event.detail);
    }
  }

  @HostListener('tap-delegate', ['$event'])
  public onTap(event: CustomEvent) {
    if (DragMoveHandlerDirective.canHandleDragMove(event.target)) {
      this.dragService.onTap(new DraggableItemImpl(event.detail.target), event.detail.center);
    }
  }

  @HostListener('panstart-delegate', ['$event'])
  public onPanStart(event: CustomEvent) {
    if (DragMoveHandlerDirective.canHandleDragMove(event.target)) {
      this.dragService.onPanStart(new DraggableItemImpl(event.detail.target), event.detail.center, null);
    }
  }

  @HostListener('panmove-delegate', ['$event'])
  public onPanMove(event: CustomEvent) {
    if (DragMoveHandlerDirective.canHandleDragMove(event.target)) {
      this.dragService.onPanMove(event.detail.center);
    }
  }

  @HostListener('panend-delegate', ['$event'])
  public onPanEnd(event: CustomEvent) {
    if (DragMoveHandlerDirective.canHandleDragMove(event.target)) {
      this.dragService.onPanEnd(event.detail.center);
    }
  }

  @HostListener('pancancel-delegate', ['$event'])
  public onPanCancel(event: CustomEvent) {
    if (DragMoveHandlerDirective.canHandleDragMove(event.target)) {
      this.dragService.onPanCancel(event.detail.center);
    }
  }

  private static canHandleDragMove(target: EventTarget | HTMLElement): boolean {
    return (<HTMLElement> target).dataset[DragMoveHandlerDirective.ATTR_NAME_DRAGGABLE] === 'true';
  }

}
