import { Component, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ElementRepositoryService } from '../services/element-repository.service';
import { ElementSelectionService } from '../services/element-selection.service';
import { Subscription } from 'rxjs';
import { PreviewService } from '../../drag/preview.service';
import { DropZoneService, DropZone } from '../../drag/drop-zone.service';
import { PageCoordinates } from '../../shared/PageCoordinates';
import { DragMoveEventListener } from '../../drag/DragMoveEventListener';
import { DragMoveService } from '../../drag/drag-move.service';
import { DragBaseService } from '../../drag/drag-base.service';
import { DomHelper } from '../../shared/DomHelper';
import { PageCoordinatesHelper } from '../../shared/PageCoordinatesHelper';

@Component({
  selector: 'app-element-compositor',
  template: `<div style="position:absolute;top:0;bottom:0;left:0;right:0"
                  data-drag-parent-for="root"></div>`
})
export class ElementCompositorComponent implements OnInit, OnDestroy, DropZone, DragMoveEventListener {

  public static ROOT_PARENT_NAME = 'root';

  private subscription: Subscription = null;

  constructor(
    private elementRef: ElementRef,
    private elementRepositoryService: ElementRepositoryService,
    private elementSelectionService: ElementSelectionService,
    private dropZoneService: DropZoneService,
    private dragMoveService: DragMoveService) {}

  public ngOnInit() {
    this.subscription = this.elementRepositoryService.subscribeToNewElementAdded({
      next: editorElement => {
        DragMoveService.registerMoveListeners(editorElement.htmlDom, this);
        editorElement.htmlDom.dataset[DragBaseService.DATA_ATTR_CHILDREN_OF] = ElementCompositorComponent.ROOT_PARENT_NAME;
        DomHelper.getElement(this.elementRef).children[0].appendChild(editorElement.htmlDom);
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
    return label === 'palette' && PageCoordinatesHelper.isInsideElement(this.elementRef, coordinates);
  }

  public onDropZoneActivated(source: HTMLElement, coordinates: PageCoordinates) {
    coordinates = PreviewService.addPreviewPadding(coordinates);
    const [x, y] = PageCoordinatesHelper.toElementCoordinates(this.elementRef, coordinates);
    if (source.dataset['paletteTemplate']) {
      this.elementRepositoryService.addEditorElement(source.dataset['paletteTemplate'], x, y);
    }
  }

  public diffuseClick(event: MouseEvent) {
    if (this.canHandleDragMove(event.target)) {
      this.dragMoveService.diffuseClick(event);
    }
  }

  @HostListener('tap', ['$event'])
  public onTapHost(event: HammerInput) {
    this.selectElement(event.target);
  }

  public onTap(target: HTMLElement, point: HammerPoint, data: any) {
    this.selectElement(target);
  }

  public onPanStart(target: HTMLElement, point: HammerPoint, data: any) {
    if (this.canHandleDragMove(target)) {
      this.selectElement(target);
      this.dragMoveService.onPanStart(target, point, data);
    }
  }

  public onPanMove(target: HTMLElement, point: HammerPoint, data: any) {
    if (this.canHandleDragMove(target)) {
      this.dragMoveService.onPanMove(target, point, data);
    }
  }

  public onPanEnd(target: HTMLElement, point: HammerPoint, data: any) {
    if (this.canHandleDragMove(target)) {
      this.dragMoveService.onPanEnd(target, point, data);
    }
  }

  public onPanCancel(target: HTMLElement, point: HammerPoint, data: any) {
    if (this.canHandleDragMove(target)) {
      this.dragMoveService.onPanCancel(target, point, data);
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
