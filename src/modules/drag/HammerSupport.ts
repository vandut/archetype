import { DragEventListener } from './DragEventListener';

export class HammerSupport {

  private static configureHammer(target: HTMLElement): HammerManager {
    const hammer = new Hammer(target);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });
    return hammer;
  }

  public static registerDragEventListener(target: HTMLElement, listener: DragEventListener) {
    const hammer = HammerSupport.configureHammer(target);
    hammer.on('tap',       event => listener.onTap(event.target, event.center, null));
    hammer.on('panstart',  event => listener.onPanStart(event.target, event.center, null));
    hammer.on('panmove',   event => listener.onPanMove(event.center));
    hammer.on('panend',    event => listener.onPanEnd(event.center));
    hammer.on('pancancel', event => listener.onPanCancel(event.center));

    target.addEventListener('mousedown', event => listener.diffuseClick(event));
  }

  public static registerEventDelegator(target: HTMLElement) {
    const hammer = HammerSupport.configureHammer(target);
    hammer.on('tap',       event => HammerSupport.delegateEvent(target, event));
    hammer.on('panstart',  event => HammerSupport.delegateEvent(target, event));
    hammer.on('panmove',   event => HammerSupport.delegateEvent(target, event));
    hammer.on('panend',    event => HammerSupport.delegateEvent(target, event));
    hammer.on('pancancel', event => HammerSupport.delegateEvent(target, event));

    target.addEventListener('mousedown', event => HammerSupport.delegateEvent(target, event));
  }

  private static delegateEvent(delegate: HTMLElement, event: any) {
    const payload = new CustomEvent(`${event.type}-delegate`, { detail: event, bubbles: true });
    delegate.dispatchEvent(payload);
  }

}
