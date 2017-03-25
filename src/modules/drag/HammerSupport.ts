import { DragEventListener } from './DragEventListener';
import { DraggableItem } from './DraggableItem';

export class HammerSupport {

  private static configureHammer(draggableItem: DraggableItem): HammerManager {
    const hammer = new Hammer(draggableItem.getDom());
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });
    return hammer;
  }

  public static registerDragEventListener(draggableItem: DraggableItem, listener: DragEventListener) {
    const hammer = HammerSupport.configureHammer(draggableItem);
    hammer.on('tap',       event => listener.onTap(draggableItem, event.center));
    hammer.on('panstart',  event => listener.onPanStart(draggableItem, event.center, null));
    hammer.on('panmove',   event => listener.onPanMove(event.center));
    hammer.on('panend',    event => listener.onPanEnd(event.center));
    hammer.on('pancancel', event => listener.onPanCancel(event.center));

    draggableItem.getDom().addEventListener('mousedown', event => listener.diffuseClick(event));
  }

  public static registerEventDelegator(draggableItem: DraggableItem) {
    const hammer = HammerSupport.configureHammer(draggableItem);
    hammer.on('tap',       event => HammerSupport.delegateEvent(draggableItem, event));
    hammer.on('panstart',  event => HammerSupport.delegateEvent(draggableItem, event));
    hammer.on('panmove',   event => HammerSupport.delegateEvent(draggableItem, event));
    hammer.on('panend',    event => HammerSupport.delegateEvent(draggableItem, event));
    hammer.on('pancancel', event => HammerSupport.delegateEvent(draggableItem, event));

    draggableItem.getDom().addEventListener('mousedown', event => HammerSupport.delegateEvent(draggableItem, event));
  }

  private static delegateEvent(draggableItem: DraggableItem, event: any) {
    const payload = new CustomEvent(`${event.type}-delegate`, { detail: event, bubbles: true });
    draggableItem.getDom().dispatchEvent(payload);
  }

}
