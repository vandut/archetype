import { Directive, HostListener, EventEmitter, Output } from '@angular/core';
import { PreviewService } from './preview.service';
import { PageCoordinatesHelper } from '../shared/PageCoordinatesHelper';
import { DropZoneService } from './drop-zone.service';
import { PageCoordinates } from '../shared/PageCoordinates';
import { DraggableItemService } from './draggable-item.service';

@Directive({
  selector: '[dragPreview]'
})
export class PreviewDirective {
  private static PADDING = 10;

  private static DATA_ATTR_PREVIEW = 'dragPreview';
  private static DATA_ATTR_LABEL = 'dragLabel';

  @Output('previewstart')
  public previewStart: EventEmitter<HammerInput> = new EventEmitter();

  constructor(private previewService: PreviewService,
              private dropZoneService: DropZoneService,
              private draggableItemService: DraggableItemService) {}

  @HostListener('mousedown', ['$event'])
  public diffuseClick(event: MouseEvent) {
    this.previewService.diffuseClick(event);
  }

  @HostListener('panstart', ['$event'])
  public onPanStart(event: HammerInput) {
    const draggableItem = this.draggableItemService.copyDraggableItem(event.target);
    if (draggableItem.isDragEnabled()) {
      if (PreviewDirective.isPreviewCopy(event.target)) {
        this.previewService.onPanStart(draggableItem, event.center);
      } else {
        this.previewStart.emit(event);
      }
    }
  }

  @HostListener('panmove', ['$event'])
  public onPanMove(event: HammerInput) {
    this.previewService.onPanMove(event.center);
  }

  @HostListener('panend', ['$event'])
  public onPanEnd(event: HammerInput) {
    this.previewService.onPanEnd(event.center);
    const label = event.target.dataset[PreviewDirective.DATA_ATTR_LABEL];
    let coordinates = PageCoordinatesHelper.fromPosition2D(event.center);
    coordinates = PreviewDirective.addPreviewPadding(coordinates);
    const dropZone = this.dropZoneService.findDropZone(label, coordinates);
    if (dropZone) {
      dropZone.onDropZoneActivated(event.target, coordinates);
    }
  }

  @HostListener('pancancel', ['$event'])
  public onPanCancel(event: HammerInput) {
    this.previewService.onPanCancel(event.center);
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
