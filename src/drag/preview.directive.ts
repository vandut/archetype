import { Directive, HostListener, EventEmitter, Output } from '@angular/core';
import { PreviewService } from './preview.service';
import { PageCoordinates } from '../shared/PageCoordinates';
import { DropZoneService } from './drop-zone.service';

@Directive({
  selector: '[dragPreview]'
})
export class PreviewDirective {
  private static DATA_ATTR_ENABLED = 'dragEnabled';
  private static DATA_ATTR_PREVIEW = 'dragPreview';
  private static DATA_ATTR_LABEL = 'dragLabel';

  @Output('previewstart')
  public previewStart: EventEmitter<HammerInput> = new EventEmitter();

  constructor(private previewService: PreviewService,
              private dropZoneService: DropZoneService) {}

  @HostListener('mousedown', ['$event'])
  public diffuseClick(event: MouseEvent) {
    if (event.button === 0 && PreviewDirective.isDragEnabled(<HTMLElement> event.target)) {
      event.preventDefault();
    }
  }

  @HostListener('panstart', ['$event'])
  public onPanStart(event: HammerInput) {
    if (PreviewDirective.isDragEnabled(event.target)) {
      if (PreviewDirective.isPreviewCopy(event.target)) {
        this.previewService.startPreview(event.target, PreviewDirective.hammerPoint2Coordinates(event.center));
      } else {
        this.previewStart.emit(event);
      }
    }
  }

  @HostListener('panmove', ['$event'])
  public onPanMove(event: HammerInput) {
    if (PreviewDirective.isDragEnabled(event.target)) {
      this.previewService.movePreview(PreviewDirective.hammerPoint2Coordinates(event.center));
    }
  }

  @HostListener('panend', ['$event'])
  public onPanEnd(event: HammerInput) {
    if (PreviewDirective.isDragEnabled(event.target)) {
      this.previewService.endPreview();
      const label = event.target.dataset[PreviewDirective.DATA_ATTR_LABEL];
      const coordinates = PreviewDirective.hammerPoint2Coordinates(event.center);
      const dropZone = this.dropZoneService.findDropZone(label, coordinates);
      if (dropZone) {
        dropZone.onDropZoneActivated(event.target, coordinates);
      }
    }
  }

  @HostListener('pancancel', ['$event'])
  public onPanCancel(event: HammerInput) {
    if (PreviewDirective.isDragEnabled(event.target)) {
      this.previewService.endPreview();
    }
  }

  private static isDragEnabled(htmlElement: HTMLElement): boolean {
    return !htmlElement.dataset[PreviewDirective.DATA_ATTR_ENABLED] || htmlElement.dataset[PreviewDirective.DATA_ATTR_ENABLED] === 'true';
  }

  private static isPreviewCopy(htmlElement: HTMLElement): boolean {
    return !htmlElement.dataset[PreviewDirective.DATA_ATTR_PREVIEW] || htmlElement.dataset[PreviewDirective.DATA_ATTR_PREVIEW] === 'copy';
  }

  public static hammerPoint2Coordinates(point: HammerPoint): PageCoordinates {
    return {
      pageX: point.x,
      pageY: point.y
    };
  }

}
