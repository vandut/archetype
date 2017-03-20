import { HTMLElementChmod, HTMLElementTransformer } from '../shared/HTMLElement';
import { DragMoveEventListener } from './DragMoveEventListener';

export abstract class DragBaseService implements DragMoveEventListener {

  public static ATTR_NAME_DRAGGABLE = 'draggable';
  private static DATA_ATTR_PARENT_FOR = 'dragParentFor';
  private static DATA_ATTR_CHILD_OF = 'dragChildOf';

  public static registerMoveListeners(target: HTMLElement, listener: DragMoveEventListener) {
    target.dataset[DragBaseService.ATTR_NAME_DRAGGABLE] = 'true';
    const hammerTime = new Hammer(target);
    hammerTime.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });
    target.addEventListener('mousedown', event => listener.diffuseClick(event));
    hammerTime.on('tap', event => listener.onTap(event.target, event.center, null));
    hammerTime.on('panstart', event => listener.onPanStart(event.target, event.center, null));
    hammerTime.on('panmove', event => listener.onPanMove(event.target, event.center, null));
    hammerTime.on('panend', event => listener.onPanEnd(event.target, event.center, null));
    hammerTime.on('pancancel', event => listener.onPanCancel(event.target, event.center, null));
  }

  public static registerParentFor(target: HTMLElement, name: string) {
    target.dataset[DragBaseService.DATA_ATTR_PARENT_FOR] = name;
  }

  public static registerChildOf(target: HTMLElement, parentName: string) {
    target.dataset[DragBaseService.DATA_ATTR_CHILD_OF] = parentName;
  }

  protected firstXY: HammerPoint = null;
  protected lastXY: HammerPoint = null;
  protected parent: HTMLElementChmod = null;

  public diffuseClick(event: MouseEvent) {
    if (event.button === 0) {
      event.preventDefault();
    }
  }

  public onTap(target: HTMLElement, point: HammerPoint, data: any) {
  }

  public onPanStart(target: HTMLElement, point: HammerPoint, data: any) {
    this.firstXY = point;
    this.lastXY = point;
    this.parent = this.findParent(target);
  }

  public onPanMove(target: HTMLElement, point: HammerPoint, data: any) {
    this.lastXY = this.moveTo(target, point, data);
  }

  public onPanEnd(target: HTMLElement, point: HammerPoint, data: any) {
    this.moveTo(target, point, data);
    this.firstXY = null;
    this.lastXY = null;
    this.parent = null;
  }

  public onPanCancel(target: HTMLElement, point: HammerPoint, data: any) {
    this.moveTo(target, this.firstXY, data);
    this.firstXY = null;
    this.lastXY = null;
    this.parent = null;
  }

  private moveTo(target: HTMLElement, point: HammerPoint, data: any): HammerPoint {
    if (this.parent) {
      return this.moveToAdvanced(HTMLElementTransformer.of(target), point, data);
    } else {
      return this.moveToSimple(HTMLElementTransformer.of(target), point, data);
    }
  }

  protected abstract moveToSimple(target: HTMLElementTransformer, point: HammerPoint, data: any): HammerPoint;

  protected abstract moveToAdvanced(target: HTMLElementTransformer, point: HammerPoint, data: any): HammerPoint;

  private findParent(target: HTMLElement): HTMLElementChmod {
    if (target.dataset[DragBaseService.DATA_ATTR_CHILD_OF]) {
      let parent = target.parentElement;
      while (parent !== null) {
        if (parent.dataset[DragBaseService.DATA_ATTR_PARENT_FOR] === target.dataset[DragBaseService.DATA_ATTR_CHILD_OF]) {
          return HTMLElementChmod.of(parent);
        }
        parent = parent.parentElement;
      }
    }
    return null;
  }

}