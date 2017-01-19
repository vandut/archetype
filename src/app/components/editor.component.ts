import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { SnappingGridComponent } from './snapping-grid.component';
import { ElementCompositorComponent } from './element-compositor.component';
import { ElementSelectionComponent } from './element-selection.component';
import { PageCoordinates } from '../utils/PageCoordinates';
import { HTMLElementChmod } from '../utils/HTMLElement';
import { SelectionActionType, SelectionMessage, SelectionComponent } from './selection.component';
import { DragDetail, DragBeginListener, DragMoveListener, DragEndListener } from '../services/drag.service';
import { ElementPreviewComponent } from './element-preview.component';
import { ElementPaletteComponent } from './element-palette.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {

  @ViewChild(SnappingGridComponent)
  private snappingGrid: SnappingGridComponent;

  @ViewChild(ElementCompositorComponent)
  private elementCompositor: ElementCompositorComponent;

  @ViewChild(ElementSelectionComponent)
  private selectionLayer: ElementSelectionComponent;

  constructor(private elementRef: ElementRef) {}

  @DragBeginListener()
  private onDragBegin(detail: DragDetail<SelectionMessage, MouseEvent>) {
    if (detail.source instanceof SelectionComponent) {
      if (detail.data.action == SelectionActionType.Move) {
        // TODO: to implement Move operation
      }
    }
  }

  @DragMoveListener()
  private onDragMove(detail: DragDetail<SelectionMessage, MouseEvent>) {
    if (detail.source instanceof SelectionComponent && this.isPageCoordinatesInside(detail.cause)) {
      if (this.isResizeAction(detail.data.action)) {
        ResizeOperation.apply(detail.data.target, detail.cause, detail.data.action, this.getParentElement());
      } else {
        // TODO: to implement Move operation
      }
    }
  }

  @DragEndListener()
  private onDragEnd(detail: DragDetail<any, MouseEvent>) {
    let inside = this.isPageCoordinatesInside(detail.cause);
    if (detail.source instanceof ElementPaletteComponent && inside) {
      this.addElement(detail.data, detail.cause);
    } else if (detail.source instanceof SelectionComponent) {
      if (this.isResizeAction(detail.data.action)) {
        ResizeOperation.apply(detail.data.target, detail.cause, detail.data.action, this.getParentElement());
      } else {
        // TODO: to implement Move operation
      }
    }
  }

  private getParentElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  private isPageCoordinatesInside(coordinates: PageCoordinates): boolean {
    return this.elementCompositor.isPageCoordinatesInsideComponent(coordinates);
  }

  private isResizeAction(action: SelectionActionType): boolean {
    switch (action) {
      case SelectionActionType.Resize_N:
      case SelectionActionType.Resize_S:
      case SelectionActionType.Resize_W:
      case SelectionActionType.Resize_E:
      case SelectionActionType.Resize_NW:
      case SelectionActionType.Resize_NE:
      case SelectionActionType.Resize_SW:
      case SelectionActionType.Resize_SE:
        return true;
      default:
        return false;
    }
  }

  private addElement(template: string, coordinates: PageCoordinates) {
    coordinates = ElementPreviewComponent.addPaddingToPageCoordinates(coordinates);
    let element = this.elementCompositor.addElement(template, coordinates);
    this.selectionLayer.selectTarget(element);
  }

  private onElementSelected(element: HTMLElement) {
    if (element) {
      this.selectionLayer.selectTarget(element);
    } else {
      this.selectionLayer.clearSelection();
    }
  }

}

class ResizeOperation {

  static apply(htmlElement: HTMLElement, coordinates: PageCoordinates, action: SelectionActionType, parentNode: HTMLElement) {
    new ResizeOperation(HTMLElementChmod.of(htmlElement)).implementation(coordinates, action, parentNode.getBoundingClientRect());
  }

  private constructor(private chmod: HTMLElementChmod) {}

  private get rect(): ClientRect {
    return this.chmod.clientRect;
  }

  private set left(l: number) {
    if (this.chmod.width + this.chmod.left - l >= 0) {
      this.chmod.width = this.chmod.width + this.chmod.left - l;
      this.chmod.left = l;
    }
  }

  private set top(t: number) {
    if (this.chmod.height + this.chmod.top - t >= 0) {
      this.chmod.height = this.chmod.height + this.chmod.top - t;
      this.chmod.top = t;
    }
  }

  private set width(w: number) {
    this.chmod.width = w;
  }

  private set height(h: number) {
    this.chmod.height = h;
  }

  private implementation(coordinates: PageCoordinates, action: SelectionActionType, originRect: ClientRect) {
    let l = coordinates.pageX - originRect.left;
    let t = coordinates.pageY - originRect.top;
    let w = coordinates.pageX - this.rect.left;
    let h = coordinates.pageY - this.rect.top;

    switch (action) {
      case SelectionActionType.Resize_N:
        this.top = t;
        break;
      case SelectionActionType.Resize_S:
        this.height = h;
        break;
      case SelectionActionType.Resize_W:
        this.left = l;
        break;
      case SelectionActionType.Resize_E:
        this.width = w;
        break;
      case SelectionActionType.Resize_NW:
        this.top = t;
        this.left = l;
        break;
      case SelectionActionType.Resize_NE:
        this.top = t;
        this.width = w;
        break;
      case SelectionActionType.Resize_SW:
        this.height = h;
        this.left = l;
        break;
      case SelectionActionType.Resize_SE:
        this.height = h;
        this.width = w;
        break;
      default:
        return;
    }
  }

}
