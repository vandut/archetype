import { Position2D } from '../shared/Position2D';
import { DraggableItemImpl } from './DraggableItem';

export interface DragEventListener {
  diffuseClick(event: MouseEvent);
  onTap(draggableItem: DraggableItemImpl, position: Position2D);
  onPanStart(draggableItem: DraggableItemImpl, position: Position2D, resizeType: string);
  onPanMove(position: Position2D);
  onPanEnd(position: Position2D);
  onPanCancel(position: Position2D);
}

export class DragEventListenerWrapper implements DragEventListener {

  constructor(private listener: DragEventListener) {}

  public diffuseClick(event: MouseEvent) {
    this.listener.diffuseClick(event);
  }

  public onTap(draggableItem: DraggableItemImpl, position: Position2D) {
    this.listener.onTap(draggableItem, position);
  }

  public onPanStart(draggableItem: DraggableItemImpl, position: Position2D, resizeType: string) {
    this.listener.onPanStart(draggableItem, position, resizeType);
  }

  public onPanMove(position: Position2D) {
    this.listener.onPanMove(position);
  }

  public onPanEnd(position: Position2D) {
    this.listener.onPanEnd(position);
  }

  public onPanCancel(position: Position2D) {
    this.listener.onPanCancel(position);
  }

}
