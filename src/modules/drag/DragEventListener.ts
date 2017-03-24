import { DragBaseService } from './drag-base.service';
import { Position2D } from '../shared/Position2D';

export interface DragEventListener {
  diffuseClick(event: MouseEvent);
  onTap(target: HTMLElement, point: Position2D, data: any);
  onPanStart(target: HTMLElement, point: Position2D, data: any);
  onPanMove(point: Position2D);
  onPanEnd(point: Position2D);
  onPanCancel(point: Position2D);
}

export class ForwardingDragEventListener implements DragEventListener {

  constructor(private dragBaseService: DragBaseService) {}

  public diffuseClick(event: MouseEvent) {
    this.dragBaseService.diffuseClick(event);
  }

  public onTap(target: HTMLElement, point: Position2D, data: any) {
    this.dragBaseService.onTap(target, point, data);
  }

  public onPanStart(target: HTMLElement, point: Position2D, data: any) {
    this.dragBaseService.onPanStart(target, point, data);
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
