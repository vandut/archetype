import { Component, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ElementRepositoryService, ElementRepositoryHelper } from '../../services/element-repository.service';
import { ElementSelectionService } from '../../services/element-selection.service';
import { Subscription } from 'rxjs';
import { PreviewService } from '../../../drag/preview.service';
import { DropZoneService, DropZone } from '../../../drag/drop-zone.service';
import { PageCoordinates } from '../../../shared/PageCoordinates';
import { DomHelper } from '../../../shared/DomHelper';
import { PageCoordinatesHelper } from '../../../shared/PageCoordinatesHelper';
import { DragMoveHandlerDirective } from '../../../drag/drag-move-handler.directive';

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
    private dropZoneService: DropZoneService) {}

  public ngOnInit() {
    const parentElement = <HTMLElement> DomHelper.getElement(this.elementRef).children[0];
    ElementRepositoryHelper.registerIsParentForRoot(parentElement);
    this.subscription = this.elementRepositoryService.subscribeToNewElementAdded({
      next: editorElement => {
        DragMoveHandlerDirective.registerAsDraggable(editorElement.htmlDom);
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
    coordinates = PreviewService.addPreviewPadding(coordinates);
    const [x, y] = PageCoordinatesHelper.toElementCoordinates(this.elementRef, coordinates);
    if (source.dataset['paletteTemplate']) {
      this.elementRepositoryService.addEditorElement(source.dataset['paletteTemplate'], x, y);
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
