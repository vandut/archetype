import { Directive, HostListener, EventEmitter, Output } from '@angular/core';
import { PreviewService } from './preview.service';
import { PageCoordinatesHelper } from '../shared/PageCoordinatesHelper';
import { DropZoneService } from './drop-zone.service';
import { PageCoordinates } from '../shared/PageCoordinates';

@Directive({
  selector: '[dragPreview]'
})
export class PreviewDirective {
  private static PADDING = 10;

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
        this.previewService.startPreview(event.target, PageCoordinatesHelper.fromPosition2D(event.center));
      } else {
        this.previewStart.emit(event);
      }
    }
  }

  @HostListener('panmove', ['$event'])
  public onPanMove(event: HammerInput) {
    if (PreviewDirective.isDragEnabled(event.target)) {
      this.previewService.movePreview(PageCoordinatesHelper.fromPosition2D(event.center));
    }
  }

  @HostListener('panend', ['$event'])
  public onPanEnd(event: HammerInput) {
    if (PreviewDirective.isDragEnabled(event.target)) {
      this.previewService.endPreview();
      const label = event.target.dataset[PreviewDirective.DATA_ATTR_LABEL];
      let coordinates = PageCoordinatesHelper.fromPosition2D(event.center);
      coordinates = PreviewDirective.addPreviewPadding(coordinates);
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

  private static addPreviewPadding(coordinates: PageCoordinates): PageCoordinates {
    return {
      pageX: coordinates.pageX - PreviewDirective.PADDING,
      pageY: coordinates.pageY - PreviewDirective.PADDING
    };
  }

}
