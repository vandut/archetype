import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { ElementRepositoryService } from '../services/element-repository.service';
import { ElementSelectionService } from '../services/element-selection.service';
import { LegacyDragService } from '../services/legacy-drag.service';
import { MoveDragMessage, SelectionActionType } from './selection.component';
import { Subscription } from 'rxjs';
import { PreviewService } from '../services/preview.service';
import { DropZoneService, DropZone } from '../services/drop-zone.service';
import { PageCoordinates } from '../utils/PageCoordinates';

@Component({
  selector: 'app-element-compositor',
  template: ``
})
export class ElementCompositorComponent extends BaseDomManipulationComponent implements OnInit, OnDestroy, DropZone {

  private subscription: Subscription = null;

  constructor(
    elementRef: ElementRef,
    private elementRepositoryService: ElementRepositoryService,
    private elementSelectionService: ElementSelectionService,
    private legacyDragService: LegacyDragService,
    private dropZoneService: DropZoneService)
  {
    super(elementRef);
  }

  public ngOnInit() {
    this.subscription = this.elementRepositoryService.subscribeToNewElementAdded({
      next: editorElement => {
        this.getNativeElement().appendChild(editorElement.htmlDom);
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

  @HostListener('mousedown', ['$event'])
  public diffuseClick(event: MouseEvent) {
    if (event.button == 0) {
      event.preventDefault();
    }
  }

  @HostListener('tap', ['$event'])
  public onTap(event: HammerInput) {
    this.selectElement(<HTMLElement> event.srcEvent.target);
  }

  @HostListener('panstart', ['$event'])
  public onPanStart(event: HammerInput) {
    this.selectElement(<HTMLElement> event.srcEvent.target);
    this.startDrag(<MouseEvent> event.srcEvent);
  }

  private selectElement(target: HTMLElement) {
    this.elementSelectionService.select(target.dataset[ElementRepositoryService.ID_DATA_ATTR_NAME]);
  }

  private startDrag(event: MouseEvent) {
    const message = new MoveDragMessage(<HTMLElement> event.target, SelectionActionType.Move);
    this.legacyDragService.beginDrag(this, message, event);
  }

}
