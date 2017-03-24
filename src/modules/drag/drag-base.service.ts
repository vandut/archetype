import { DragEventListener } from './DragEventListener';
import { Position2D } from '../shared/Position2D';
import { DraggableItemImpl } from './DraggableItem';

export abstract class DragBaseService implements DragEventListener {

  protected firstXY: Position2D = null;
  protected lastXY: Position2D = null;
  protected draggableItem: DraggableItemImpl = null;
  protected moveType: string = null;

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
    this.moveType = data;
  }

  public onPanMove(point: Position2D) {
    this.lastXY = this.moveTo(point);
  }

  public onPanEnd(point: Position2D) {
    this.moveTo(point);
    this.firstXY = null;
    this.lastXY = null;
    this.draggableItem = null;
  }

  public onPanCancel(point: Position2D) {
    this.moveTo(this.firstXY);
    this.firstXY = null;
    this.lastXY = null;
    this.draggableItem = null;
  }

  protected abstract moveTo(point: Position2D): Position2D;

}
