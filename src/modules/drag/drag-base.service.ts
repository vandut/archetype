import { DragMoveEventListener } from './DragMoveEventListener';
import { Position2D } from '../shared/Position2D';
import { DraggableItemImpl } from './DraggableItem';

export abstract class DragBaseService implements DragMoveEventListener {

  public static ATTR_NAME_DRAGGABLE = 'draggable';

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

  protected firstXY: Position2D = null;
  protected lastXY: Position2D = null;
  protected draggableItem: DraggableItemImpl = null;

  public diffuseClick(event: MouseEvent) {
    if (event.button === 0) {
      event.preventDefault();
    }
  }

  public onTap(target: HTMLElement, point: Position2D, data: any) {
  }

  public onPanStart(target: HTMLElement, point: Position2D, data: any) {
    this.firstXY = point;
    this.lastXY = point;
    this.draggableItem = new DraggableItemImpl(target);
  }

  public onPanMove(target: HTMLElement, point: Position2D, data: any) {
    this.lastXY = this.moveTo(point, data);
  }

  public onPanEnd(target: HTMLElement, point: Position2D, data: any) {
    this.moveTo(point, data);
    this.firstXY = null;
    this.lastXY = null;
    this.draggableItem = null;
  }

  public onPanCancel(target: HTMLElement, point: Position2D, data: any) {
    this.moveTo(this.firstXY, data);
    this.firstXY = null;
    this.lastXY = null;
    this.draggableItem = null;
  }

  protected abstract moveTo(point: Position2D, data: any): Position2D;

}
