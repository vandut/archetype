import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { ElementRepositoryService } from '../services/element-repository.service';
import { ElementSelectionService } from '../services/element-selection.service';
import { Subscription } from 'rxjs';
import { PreviewService } from '../services/preview.service';
import { DropZoneService, DropZone } from '../services/drop-zone.service';
import { PageCoordinates } from '../utils/PageCoordinates';
import { DragMoveService, DragMoveEventListener } from '../services/drag-move.service';

@Component({
  selector: 'app-element-compositor',
  template: `<div style="position:absolute;top:0;bottom:0;left:0;right:0"
                  data-drag-parent-for="root"></div>`
})
export class ElementCompositorComponent extends BaseDomManipulationComponent implements OnInit, OnDestroy, DropZone, DragMoveEventListener {

  public static ROOT_PARENT_NAME = 'root';

  private subscription: Subscription = null;

  constructor(
    elementRef: ElementRef,
    private elementRepositoryService: ElementRepositoryService,
    private elementSelectionService: ElementSelectionService,
    private dropZoneService: DropZoneService,
    private dragMoveService: DragMoveService)
  {
    super(elementRef);
  }

  public ngOnInit() {
    this.subscription = this.elementRepositoryService.subscribeToNewElementAdded({
      next: editorElement => {
        DragMoveService.registerMoveListeners(editorElement.htmlDom, this);
        editorElement.htmlDom.dataset[DragMoveService.DATA_ATTR_CHILDREN_OF] = ElementCompositorComponent.ROOT_PARENT_NAME;
        this.getNativeElement().children[0].appendChild(editorElement.htmlDom);
        this.elementSelectionService.select(editorElement.id);
      }
    });
    this.dropZoneService.addDropZone(this);
  }

  public ngOnDestroy() {
    this.dropZoneService.removeDropZone(this);
    this.subscription.unsubscribe();
  }

  public isInDropZone(label: string, coordinates: PageCoordinates): boolean {
    return label === 'palette' && this.isPageCoordinatesInsideComponent(coordinates);
  }

  public onDropZoneActivated(source: HTMLElement, coordinates: PageCoordinates) {
    coordinates = PreviewService.addPreviewPadding(coordinates);
    const [x, y] = this.toComponentCoordinates(coordinates);
    if (source.dataset['paletteTemplate']) {
      this.elementRepositoryService.addEditorElement(source.dataset['paletteTemplate'], x, y);
    }
  }

  public diffuseClick(event: MouseEvent) {
    if (this.canHandleDragMove(event.target)) {
      this.dragMoveService.diffuseClick(event);
    }
  }

  public onTap(target: HTMLElement, point: HammerPoint) {
    this.selectElement(target);
  }

  public onPanStart(target: HTMLElement, point: HammerPoint) {
    if (this.canHandleDragMove(target)) {
      this.selectElement(target);
      this.dragMoveService.onPanStart(target, point);
    }
  }

  public onPanMove(target: HTMLElement, point: HammerPoint) {
    if (this.canHandleDragMove(target)) {
      this.dragMoveService.onPanMove(target, point);
    }
  }

  public onPanEnd(target: HTMLElement, point: HammerPoint) {
    if (this.canHandleDragMove(target)) {
      this.dragMoveService.onPanEnd(target, point);
    }
  }

  public onPanCancel(target: HTMLElement, point: HammerPoint) {
    if (this.canHandleDragMove(target)) {
      this.dragMoveService.onPanCancel(target, point);
    }
  }

  private canHandleDragMove(target: EventTarget | HTMLElement): boolean {
    return !!this.getIndexedElementId(<HTMLElement> target);
  }

  private selectElement(target: HTMLElement) {
    this.elementSelectionService.select(target.dataset[ElementRepositoryService.ID_DATA_ATTR_NAME]);
  }

  private getIndexedElementId(htmlElement: HTMLElement) {
    return htmlElement.dataset[ElementRepositoryService.ID_DATA_ATTR_NAME];
  }

}
