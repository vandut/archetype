import { Position2D } from '../shared/Position2D';
import { DraggableItemImpl } from './DraggableItem';

export interface DragEventListener {
  diffuseClick(event: MouseEvent);
  onTap(draggableItem: DraggableItemImpl, point: Position2D, data: any);
  onPanStart(draggableItem: DraggableItemImpl, point: Position2D, data: any);
  onPanMove(point: Position2D);
  onPanEnd(point: Position2D);
  onPanCancel(point: Position2D);
}

export class DragEventListenerWrapper implements DragEventListener {

  constructor(private listener: DragEventListener) {}

  public diffuseClick(event: MouseEvent) {
    this.listener.diffuseClick(event);
  }

  public onTap(draggableItem: DraggableItemImpl, point: Position2D, data: any) {
    this.listener.onTap(draggableItem, point, data);
  }

  public onPanStart(draggableItem: DraggableItemImpl, point: Position2D, data: any) {
    this.listener.onPanStart(draggableItem, point, data);
  }

  public onPanMove(point: Position2D) {
    this.listener.onPanMove(point);
  }

  public onPanEnd(point: Position2D) {
    this.listener.onPanEnd(point);
  }

  public onPanCancel(point: Position2D) {
    this.listener.onPanCancel(point);
  }

}
