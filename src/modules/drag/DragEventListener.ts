import { DragBaseService } from './drag-base.service';
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

export class ForwardingDragEventListener implements DragEventListener {

  constructor(private dragBaseService: DragBaseService) {}

  public diffuseClick(event: MouseEvent) {
    this.dragBaseService.diffuseClick(event);
  }

  public onTap(draggableItem: DraggableItemImpl, point: Position2D, data: any) {
    this.dragBaseService.onTap(draggableItem, point, data);
  }

  public onPanStart(draggableItem: DraggableItemImpl, point: Position2D, data: any) {
    this.dragBaseService.onPanStart(draggableItem, point, data);
  }

  public onPanMove(point: Position2D) {
    this.dragBaseService.onPanMove(point);
  }

  public onPanEnd(point: Position2D) {
    this.dragBaseService.onPanEnd(point);
  }

  public onPanCancel(point: Position2D) {
    this.dragBaseService.onPanCancel(point);
  }

}
