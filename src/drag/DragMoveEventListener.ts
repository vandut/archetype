import { DragBaseService } from './drag-base.service';

export interface DragMoveEventListener {
  diffuseClick(event: MouseEvent);
  onTap(target: HTMLElement, point: HammerPoint, data: any);
  onPanStart(target: HTMLElement, point: HammerPoint, data: any);
  onPanMove(target: HTMLElement, point: HammerPoint, data: any);
  onPanEnd(target: HTMLElement, point: HammerPoint, data: any);
  onPanCancel(target: HTMLElement, point: HammerPoint, data: any);
}

export class ForwardingDragMoveEventListener implements DragMoveEventListener {

  constructor(private dragBaseService: DragBaseService) {}

  public diffuseClick(event: MouseEvent) {
    this.dragBaseService.diffuseClick(event);
  }

  public onTap(target: HTMLElement, point: HammerPoint, data: any) {
    this.dragBaseService.onTap(target, point, data);
  }

  public onPanStart(target: HTMLElement, point: HammerPoint, data: any) {
    this.dragBaseService.onPanStart(target, point, data);
  }

  public onPanMove(target: HTMLElement, point: HammerPoint, data: any) {
    this.dragBaseService.onPanMove(target, point, data);
  }

  public onPanEnd(target: HTMLElement, point: HammerPoint, data: any) {
    this.dragBaseService.onPanEnd(target, point, data);
  }

  public onPanCancel(target: HTMLElement, point: HammerPoint, data: any) {
    this.dragBaseService.onPanCancel(target, point, data);
  }

}
