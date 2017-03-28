import { Directive, HostListener } from '@angular/core';
import { PreviewCanvasService } from './preview-canvas.service';
import { DropZone, DropZoneService } from './drop-zone.service';
import { DraggableItemService } from './draggable-item.service';
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

  private sourceItem: DraggableItem = null;
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
    if (this.sourceItem || this.draggableItem) {
      console.warn("PreviewDirective: expecting sourceItem and draggableItem to be null");
    }
    const sourceItem = this.draggableItemService.getDraggableItem(event.target);
    if (sourceItem.isDragEnabled()) {
      this.sourceItem = sourceItem;
      this.draggableItem = this.prepareClonedItem(this.sourceItem);
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
    const dropZone = this.findDropZone(this.sourceItem, event.center);
    if (dropZone) {
      const position = PreviewDirective.addPreviewPadding(event.center);
      dropZone.onDropZoneActivated(this.sourceItem, position);
    }
    this.draggableItem.remove();
    this.draggableItem = null;
    this.sourceItem = null;
  }

  @HostListener('pancancel', ['$event'])
  public onPanCancel(event: HammerInput) {
    this.dragService.onPanCancel(event.center);
    this.draggableItem.remove();
    this.draggableItem = null;
    this.sourceItem = null;
  }

  private findDropZone(item: DraggableItem, position: Position2D): DropZone {
    const label = item.getData(PreviewDirective.DATA_ATTR_LABEL);
    position = PreviewDirective.addPreviewPadding(position);
    return this.dropZoneService.findDropZone(label, position);
  }

  private prepareClonedItem(targetItem: DraggableItem): DraggableItem {
    const template = targetItem.getData(PreviewDirective.DATA_ATTR_PREVIEW_TEMPLATE);

    if (template) {
      return this.draggableItemService.createDraggableItemFromTemplate(template);
    } else {
      return targetItem.getRootlessCopy();
    }
  }

  private anchorItem(item: DraggableItem, position: Position2D) {
    const canvas = this.previewCanvasService.getCanvas();
    const canvasItem = this.draggableItemService.getDraggableItem(DomHelper.getElement(canvas));
    const parentPosition = Position2DHelper.toParentElementPosition(canvas, position);

    item.makeChildOf(canvasItem);
    item.moveToPosition(parentPosition, null);
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

  private static addPreviewPadding(position: Position2D): Position2D {
    return {
      x: position.x - PreviewDirective.PADDING,
      y: position.y - PreviewDirective.PADDING
    };
  }

}
