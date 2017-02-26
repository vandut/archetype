import { Directive, HostListener } from '@angular/core';
import { PreviewService } from '../services/preview.service';
import { PageCoordinates } from '../utils/PageCoordinates';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {
  private static DRAGGABLE_DATA_ATTR = 'dragMode';

  constructor(private previewService: PreviewService) {}

  @HostListener('mousedown', ['$event'])
  public diffuseClick(event: MouseEvent) {
    if (event.button === 0 && DraggableDirective.isDraggable(<HTMLElement> event.target)) {
      event.preventDefault();
    }
  }

  @HostListener('panstart', ['$event'])
  public onPanStart(event: HammerInput) {
    if (DraggableDirective.isDraggable(event.target)) {
      this.previewService.startPreview(event.target, DraggableDirective.hammerPoint2Coordinates(event.center));
    }
  }

  @HostListener('panmove', ['$event'])
  public onPanMove(event: HammerInput) {
    if (DraggableDirective.isDraggable(event.target)) {
      this.previewService.movePreview(DraggableDirective.hammerPoint2Coordinates(event.center));
    }
  }

  @HostListener('panend', ['$event'])
  public onPanEnd(event: HammerInput) {
    if (DraggableDirective.isDraggable(event.target)) {
      this.previewService.endPreview();
    }
  }

  @HostListener('pancancel', ['$event'])
  public onPanCancel(event: HammerInput) {
    if (DraggableDirective.isDraggable(event.target)) {
      this.previewService.endPreview();
    }
  }

  private static isDraggable(htmlElement: HTMLElement): boolean {
    return htmlElement.dataset[DraggableDirective.DRAGGABLE_DATA_ATTR] === 'preview';
  }

  private static hammerPoint2Coordinates(point: HammerPoint): PageCoordinates {
    return {
      pageX: point.x,
      pageY: point.y
    };
  }

}
