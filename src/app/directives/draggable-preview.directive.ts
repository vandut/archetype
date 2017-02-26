import { Directive, HostListener } from '@angular/core';
import { PreviewService } from '../services/preview.service';
import { PageCoordinates } from '../utils/PageCoordinates';

@Directive({
  selector: '[appDraggablePreview]'
})
export class DraggablePreviewDirective {
  private static DRAGGABLE_DATA_ATTR = 'draggable';

  constructor(private previewService: PreviewService) {}

  @HostListener('mousedown', ['$event'])
  public diffuseClick(event: MouseEvent) {
    if (DraggablePreviewDirective.isDraggable(<HTMLElement> event.target)) {
      event.preventDefault();
    }
  }

  @HostListener('panstart', ['$event'])
  public onPanStart(event: HammerInput) {
    if (DraggablePreviewDirective.isDraggable(event.target)) {
      this.previewService.startPreview(event.target, DraggablePreviewDirective.hammerPoint2Coordinates(event.center));
    }
  }

  @HostListener('panmove', ['$event'])
  public onPanMove(event: HammerInput) {
    if (DraggablePreviewDirective.isDraggable(event.target)) {
      this.previewService.movePreview(DraggablePreviewDirective.hammerPoint2Coordinates(event.center));
    }
  }

  @HostListener('panend', ['$event'])
  public onPanEnd(event: HammerInput) {
    if (DraggablePreviewDirective.isDraggable(event.target)) {
      this.previewService.endPreview();
    }
  }

  @HostListener('pancancel', ['$event'])
  public onPanCancel(event: HammerInput) {
    if (DraggablePreviewDirective.isDraggable(event.target)) {
      this.previewService.endPreview();
    }
  }

  private static isDraggable(htmlElement: HTMLElement): boolean {
    return htmlElement.dataset[DraggablePreviewDirective.DRAGGABLE_DATA_ATTR] === 'true';
  }

  private static hammerPoint2Coordinates(point: HammerPoint): PageCoordinates {
    return {
      pageX: point.x,
      pageY: point.y
    };
  }

}
