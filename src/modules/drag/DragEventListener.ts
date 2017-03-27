import { Position2D } from '../shared/Position2D';
import { DraggableItem } from './DraggableItem';

export interface DragEventListener {
  diffuseClick(event: MouseEvent);
  onTap(draggableItem: DraggableItem, position: Position2D);
  onPanStart(draggableItem: DraggableItem, position: Position2D, resizeType?: string);
  onPanMove(position: Position2D);
  onPanEnd(position: Position2D);
  onPanCancel(position: Position2D);
}

export class DragEventListenerWrapper implements DragEventListener {

  constructor(private listener: DragEventListener) {}

  public diffuseClick(event: MouseEvent) {
    this.listener.diffuseClick(event);
  }

  public onTap(draggableItem: DraggableItem, position: Position2D) {
    this.listener.onTap(draggableItem, position);
  }

  public onPanStart(draggableItem: DraggableItem, position: Position2D, resizeType?: string) {
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
