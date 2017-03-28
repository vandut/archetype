import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ElementRepositoryHelper, ElementRepositoryService } from '../../services/element-repository.service';
import { ElementSelectionService } from '../../services/element-selection.service';
import { Subscription } from 'rxjs';
import { DropZone, DropZoneService } from '../../../drag/drop-zone.service';
import { DomHelper } from '../../../shared/DomHelper';
import { DragMoveHandlerDirective } from '../../../drag/drag-move-handler.directive';
import { DraggableItemService } from '../../../drag/draggable-item.service';
import { DraggableItem } from '../../../drag/DraggableItem';
import { Position2D, Position2DHelper } from '../../../shared/Position2D';

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

  public isInDropZone(label: string, position: Position2D): boolean {
    return label === 'palette' && Position2DHelper.isInsideElement(this.elementRef, position);
  }

  public onDropZoneActivated(sourceItem: DraggableItem, position: Position2D) {
    const {x, y} = Position2DHelper.toElementPosition(this.elementRef, position);
    if (sourceItem.getDom().dataset['dragPreviewTemplate']) {
      this.elementRepositoryService.addEditorElement(sourceItem.getDom().dataset['dragPreviewTemplate'], x, y);
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
