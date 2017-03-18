import { Directive, HostListener, EventEmitter, Output } from '@angular/core';
import { PreviewService } from '../services/preview.service';
import { PageCoordinates } from '../utils/PageCoordinates';
import { DropZoneService } from '../services/drop-zone.service';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {
  private static DATA_ATTR_MODE = 'dragMode';
  private static DATA_ATTR_PREVIEW = 'dragPreview';
  private static DATA_ATTR_LABEL = 'dragLabel';

  @Output('previewstart')
  public previewStart: EventEmitter<HammerInput> = new EventEmitter();

  constructor(private previewService: PreviewService,
              private dropZoneService: DropZoneService) {}

  @HostListener('mousedown', ['$event'])
  public diffuseClick(event: MouseEvent) {
    if (event.button === 0 && DraggableDirective.isDraggable(<HTMLElement> event.target)) {
      event.preventDefault();
    }
  }

  @HostListener('panstart', ['$event'])
  public onPanStart(event: HammerInput) {
    if (DraggableDirective.isModePreview(event.target)) {
      if (DraggableDirective.isPreviewCopy(event.target)) {
        this.previewService.startPreview(event.target, DraggableDirective.hammerPoint2Coordinates(event.center));
      } else {
        this.previewStart.emit(event);
      }
    }
    // TODO: Step 1: create dummy div that can be dragged
    // TODO: Step 2: delegate to legacy drag service
    // TODO: Step 6: make parent handle child drag
  }

  @HostListener('panmove', ['$event'])
  public onPanMove(event: HammerInput) {
    if (DraggableDirective.isModePreview(event.target)) {
      this.previewService.movePreview(DraggableDirective.hammerPoint2Coordinates(event.center));
    }
    // TODO: Step 3: delegate to legacy drag service
  }

  @HostListener('panend', ['$event'])
  public onPanEnd(event: HammerInput) {
    if (DraggableDirective.isModePreview(event.target)) {
      this.previewService.endPreview();
    }
    if (DraggableDirective.isDraggable(event.target)) {
      const label = event.target.dataset[DraggableDirective.DATA_ATTR_LABEL];
      const coordinates = DraggableDirective.hammerPoint2Coordinates(event.center);
      const dropZone = this.dropZoneService.findDropZone(label, coordinates);
      if (dropZone) {
        dropZone.onDropZoneActivated(event.target, coordinates);
      }
    }
    // TODO: Step 4: delegate to legacy drag service
  }

  @HostListener('pancancel', ['$event'])
  public onPanCancel(event: HammerInput) {
    if (DraggableDirective.isModePreview(event.target)) {
      this.previewService.endPreview();
    }
    // TODO: Step 5: delegate to legacy drag service
  }

  private static isDraggable(htmlElement: HTMLElement): boolean {
    return DraggableDirective.isModePreview(htmlElement);
  }

  private static isModePreview(htmlElement: HTMLElement): boolean {
    return htmlElement.dataset[DraggableDirective.DATA_ATTR_MODE] === 'preview';
  }

  private static isPreviewCopy(htmlElement: HTMLElement): boolean {
    return !htmlElement.dataset[DraggableDirective.DATA_ATTR_PREVIEW] || htmlElement.dataset[DraggableDirective.DATA_ATTR_PREVIEW] === 'copy';
  }

  public static hammerPoint2Coordinates(point: HammerPoint): PageCoordinates {
    return {
      pageX: point.x,
      pageY: point.y
    };
  }

}


// TODO: extract logic to class? not needed if parent can handle child drag
