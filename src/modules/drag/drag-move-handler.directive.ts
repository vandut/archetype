import { Directive, HostListener } from '@angular/core';
import { DragMoveService } from './drag-move.service';
import { DragBaseService } from './drag-base.service';

@Directive({
  selector: '[dragMoveHandler]'
})
export class DragMoveHandlerDirective {

  private static DELEGATED_HAMMER_EVENT_TYPES = [
    'tap',
    'panstart',
    'panmove',
    'panend',
    'pancancel'
  ];

  public static registerAsDraggable(target: HTMLElement) {
    target.dataset[DragBaseService.ATTR_NAME_DRAGGABLE] = 'true';

    const hammerTime = new Hammer(target);
    hammerTime.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });

    target.addEventListener('mousedown', event => DragMoveHandlerDirective.delegateEvent(target, event));

    for (let eventType of DragMoveHandlerDirective.DELEGATED_HAMMER_EVENT_TYPES) {
      hammerTime.on(eventType, event => DragMoveHandlerDirective.delegateEvent(target, event));
    }
  }

  private static delegateEvent(delegate: HTMLElement, event: any) {
    const payload = new CustomEvent(`${event.type}-delegate`, { detail: event, bubbles: true });
    delegate.dispatchEvent(payload);
  }

  constructor(
    private dragMoveService: DragMoveService) {}

  @HostListener('mousedown-delegate', ['$event'])
  public diffuseClick(event: CustomEvent) {
    if (DragMoveHandlerDirective.canHandleDragMove(event.target)) {
      this.dragMoveService.diffuseClick(event.detail);
    }
  }

  @HostListener('tap-delegate', ['$event'])
  public onTap(event: CustomEvent) {
    if (DragMoveHandlerDirective.canHandleDragMove(event.target)) {
      this.dragMoveService.onTap(event.detail.target, event.detail.center, null);
    }
  }

  @HostListener('panstart-delegate', ['$event'])
  public onPanStart(event: CustomEvent) {
    if (DragMoveHandlerDirective.canHandleDragMove(event.target)) {
      this.dragMoveService.onPanStart(event.detail.target, event.detail.center, null);
    }
  }

  @HostListener('panmove-delegate', ['$event'])
  public onPanMove(event: CustomEvent) {
    if (DragMoveHandlerDirective.canHandleDragMove(event.target)) {
      this.dragMoveService.onPanMove(event.detail.target, event.detail.center, null);
    }
  }

  @HostListener('panend-delegate', ['$event'])
  public onPanEnd(event: CustomEvent) {
    if (DragMoveHandlerDirective.canHandleDragMove(event.target)) {
      this.dragMoveService.onPanEnd(event.detail.target, event.detail.center, null);
    }
  }

  @HostListener('pancancel-delegate', ['$event'])
  public onPanCancel(event: CustomEvent) {
    if (DragMoveHandlerDirective.canHandleDragMove(event.target)) {
      this.dragMoveService.onPanCancel(event.detail.target, event.detail.center, null);
    }
  }

  private static canHandleDragMove(target: EventTarget | HTMLElement): boolean {
    return (<HTMLElement> target).dataset[DragBaseService.ATTR_NAME_DRAGGABLE] === 'true';
  }

}
