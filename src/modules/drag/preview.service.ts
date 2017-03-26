import { Injectable, ElementRef } from '@angular/core';
import { PageCoordinates } from '../shared/PageCoordinates';
import { DomHelper } from '../shared/DomHelper';
import { PageCoordinatesHelper } from '../shared/PageCoordinatesHelper';
import { DraggableItem } from './DraggableItem';
import { Position2DHelper } from '../shared/Position2D';
import { DraggableItemService } from './draggable-item.service';

// TODO: Remove this class in favour of DragService and PreviewDirective
@Injectable()
export class PreviewService {
  private static PADDING = 10;

  private canvas: ElementRef;
  private draggableItem: DraggableItem = null;

  constructor(private draggableItemService: DraggableItemService) {}

  public registerCanvas(canvas: ElementRef) {
    this.canvas = canvas;
  }

  public clearCanvas() {
    this.canvas = null;
  }

  public startPreview(target: HTMLElement, coordinates: PageCoordinates) {
    if (!this.draggableItem) {
      this.draggableItem = this.draggableItemService.getPreviewOf(target, DomHelper.getParentElement(this.canvas));
      this.movePreviewTo(coordinates);
    }
  }

  public movePreview(coordinates: PageCoordinates) {
    if (this.draggableItem) {
      if (PageCoordinatesHelper.isInsideParentElement(this.canvas, coordinates)) {
        if (!this.draggableItem.isVisible()) {
          this.draggableItem.show();
        }
        this.movePreviewTo(coordinates);
      } else {
        if (this.draggableItem.isVisible()) {
          this.draggableItem.hide();
        }
      }
    }
  }

  private movePreviewTo(coordinates: PageCoordinates) {
    coordinates = PageCoordinatesHelper.toParentElementCoordinates(this.canvas, coordinates);
    coordinates = PreviewService.addPreviewPadding(coordinates);
    this.draggableItem.moveToPosition(Position2DHelper.fromPageCoordinates(coordinates), null);
  }

  public endPreview() {
    if (this.draggableItem) {
      this.draggableItem.remove();
      this.draggableItem = null;
    }
  }

  public static addPreviewPadding(coordinates: PageCoordinates): PageCoordinates {
    return {
      pageX: coordinates.pageX - PreviewService.PADDING,
      pageY: coordinates.pageY - PreviewService.PADDING
    };
  }

}
