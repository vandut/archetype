import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ElementRepositoryHelper, ElementRepositoryService } from '../../services/element-repository.service';
import { ElementSelectionService } from '../../services/element-selection.service';
import { Subscription } from 'rxjs';
import { DropZone, DropZoneService } from '../../../drag/drop-zone.service';
import { PageCoordinates } from '../../../shared/PageCoordinates';
import { DomHelper } from '../../../shared/DomHelper';
import { PageCoordinatesHelper } from '../../../shared/PageCoordinatesHelper';
import { DragMoveHandlerDirective } from '../../../drag/drag-move-handler.directive';
import { DraggableItemService } from '../../../drag/draggable-item.service';

@Component({
  selector: 'editor-compositor-layer',
  template: `<div dragMoveHandler style="position:absolute;top:0;bottom:0;left:0;right:0"></div>`
})
export class CompositorLayerComponent implements OnInit, OnDestroy, DropZone {

  private subscription: Subscription = null;

  constructor(
    private elementRef: ElementRef,
    private elementRepositoryService: ElementRepositoryService,
    private elementSelectionService: ElementSelectionService,
    private dropZoneService: DropZoneService,
    private draggableItemService: DraggableItemService) {}

  public ngOnInit() {
    const parentElement = <HTMLElement> DomHelper.getElement(this.elementRef).children[0];
    ElementRepositoryHelper.registerIsParentForRoot(parentElement);
    this.subscription = this.elementRepositoryService.subscribeToNewElementAdded({
      next: editorElement => {
        const draggableItem = this.draggableItemService.getDraggableItem(editorElement.htmlDom);
        DragMoveHandlerDirective.registerAsDraggable(draggableItem);
        parentElement.appendChild(editorElement.htmlDom);
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
    const [x, y] = PageCoordinatesHelper.toElementCoordinates(this.elementRef, coordinates);
    if (source.dataset['dragPreviewTemplate']) {
      this.elementRepositoryService.addEditorElement(source.dataset['dragPreviewTemplate'], x, y);
    }
  }

  @HostListener('tap', ['$event'])
  public onTapHost(event: HammerInput) {
    this.selectElement(event.target);
  }

  @HostListener('panstart-delegate', ['$event'])
  public onPanStart(event: CustomEvent) {
    this.selectElement(event.detail.target);
  }

  private selectElement(target: HTMLElement) {
    this.elementSelectionService.select(target.dataset[ElementRepositoryService.ID_DATA_ATTR_NAME]);
  }

}
