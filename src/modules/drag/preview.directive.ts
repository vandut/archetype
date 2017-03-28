import { Directive, HostListener } from '@angular/core';
import { PreviewCanvasService } from './preview-canvas.service';
import { PageCoordinatesHelper } from '../shared/PageCoordinatesHelper';
import { DropZone, DropZoneService } from './drop-zone.service';
import { PageCoordinates } from '../shared/PageCoordinates';
import { DraggableItemService } from './draggable-item.service';
import { HTMLElementFactory } from '../shared/HTMLElement';
import { Position2D, Position2DHelper } from '../shared/Position2D';
import { DomHelper } from '../shared/DomHelper';
import { DraggableItem } from './DraggableItem';
import { DragService } from './drag.service';

@Directive({
  selector: '[dragPreview]'
})
export class PreviewDirective {
  private static PADDING = 10;

  private static DATA_ATTR_PREVIEW_TEMPLATE = 'dragPreviewTemplate';
  private static DATA_ATTR_LABEL = 'dragLabel';

  private draggableItem: DraggableItem = null;

  constructor(private previewCanvasService: PreviewCanvasService,
              private dropZoneService: DropZoneService,
              private draggableItemService: DraggableItemService,
              private dragService: DragService) {}

  @HostListener('mousedown', ['$event'])
  public diffuseClick(event: MouseEvent) {
    this.dragService.diffuseClick(event);
  }

  @HostListener('panstart', ['$event'])
  public onPanStart(event: HammerInput) {
    if (this.draggableItem) {
      console.warn("PreviewDirective: expecting this.draggableItem to be null");
    }
    const targetItem = this.draggableItemService.getDraggableItem(event.target);
    if (targetItem.isDragEnabled()) {
      this.draggableItem = this.prepareClonedItem(targetItem);
      this.anchorItem(this.draggableItem, event.center);
      this.dragService.onPanStart(this.draggableItem, event.center);
    }
  }

  @HostListener('panmove', ['$event'])
  public onPanMove(event: HammerInput) {
    this.adjustPreviewVisibility(event.center);
    this.dragService.onPanMove(event.center);
  }

  @HostListener('panend', ['$event'])
  public onPanEnd(event: HammerInput) {
    this.dragService.onPanEnd(event.center);
    const dropZone = this.findDropZone(event.target, event.center);
    if (dropZone) {
      let coordinates = PageCoordinatesHelper.fromPosition2D(event.center);
      coordinates = PreviewDirective.addPreviewPadding(coordinates);
      dropZone.onDropZoneActivated(event.target, coordinates);
    }
    this.draggableItem.remove();
    this.draggableItem = null;
  }

  private findDropZone(target: HTMLElement, position: Position2D): DropZone {
    const label = target.dataset[PreviewDirective.DATA_ATTR_LABEL];
    let coordinates = PageCoordinatesHelper.fromPosition2D(position);
    coordinates = PreviewDirective.addPreviewPadding(coordinates);
    return this.dropZoneService.findDropZone(label, coordinates);
  }

  @HostListener('pancancel', ['$event'])
  public onPanCancel(event: HammerInput) {
    this.dragService.onPanCancel(event.center);
    this.draggableItem.remove();
    this.draggableItem = null;
  }

  private prepareClonedItem(targetItem: DraggableItem): DraggableItem {
    const template = PreviewDirective.getPreviewTemplate(targetItem.getDom());

    if (template) {
      return this.draggableItemFromTemplate(template);
    } else {
      return targetItem.getRootlessCopy();
    }
  }

  private draggableItemFromTemplate(template: string): DraggableItem {
    return this.draggableItemService.getDraggableItem(HTMLElementFactory.fromTemplate(template));
  }

  private anchorItem(item: DraggableItem, position: Position2D) {
    const canvas = this.previewCanvasService.getCanvas();
    const canvasItem = this.draggableItemService.getDraggableItem(DomHelper.getElement(canvas));
    const parentPosition = Position2DHelper.toParentElementPosition2D(canvas, position);

    item.makeChildOf(canvasItem);
    item.moveToPosition(parentPosition, null);
  }

  private static getPreviewTemplate(htmlElement: HTMLElement): string {
    return htmlElement.dataset[PreviewDirective.DATA_ATTR_PREVIEW_TEMPLATE];
  }

  private adjustPreviewVisibility(position: Position2D) {
    if (Position2DHelper.isInsideParentElement(this.previewCanvasService.getCanvas(), position)) {
      if (!this.draggableItem.isVisible()) {
        this.draggableItem.show();
      }
    } else {
      if (this.draggableItem.isVisible()) {
        this.draggableItem.hide();
      }
    }
  }

  private static addPreviewPadding(coordinates: PageCoordinates): PageCoordinates {
    return {
      pageX: coordinates.pageX - PreviewDirective.PADDING,
      pageY: coordinates.pageY - PreviewDirective.PADDING
    };
  }

}
