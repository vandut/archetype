import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { ElementRepositoryService } from '../services/element-repository.service';
import { ElementSelectionService } from '../services/element-selection.service';
import { ElementPaletteComponent } from './element-palette.component';
import { DragDetail, DragEventNames, DragService } from '../services/drag.service';
import { SelectionDragMessage, MoveDragMessage, SelectionActionType } from './selection.component';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { PreviewService } from '../services/preview.service';

@Component({
  selector: 'app-element-compositor',
  template: ``
})
export class ElementCompositorComponent extends BaseDomManipulationComponent implements OnInit, OnDestroy {

  private subscription: Subscription = null;

  constructor(
    elementRef: ElementRef,
    private elementRepositoryService: ElementRepositoryService,
    private elementSelectionService: ElementSelectionService,
    private dragService: DragService)
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
    if (!environment.production) {
      this.elementRepositoryService.addEditorElement(ElementPaletteComponent.DEFAULT_DIV_TEMPLATE, 100, 100);
      this.elementRepositoryService.addEditorElement(ElementPaletteComponent.DEFAULT_DIV_TEMPLATE, 300, 300);
    }
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private selectElement(target: HTMLElement) {
    this.elementSelectionService.select(target.dataset[ElementRepositoryService.ID_DATA_ATTR_NAME]);
  }

  private startDrag(event: MouseEvent) {
    const message = new MoveDragMessage(<HTMLElement> event.target, SelectionActionType.Move);
    this.dragService.beginDrag(this, message, event);
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
  public onPress(event: HammerInput) {
    this.selectElement(<HTMLElement> event.srcEvent.target);
    this.startDrag(<MouseEvent> event.srcEvent);
  }

  @HostListener(DragEventNames.RECEIVE_END, ['$event.detail'])
  public onDragEnd(detail: DragDetail<any | SelectionDragMessage, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent && this.isPageCoordinatesInsideComponent(detail.cause)) {
      let coordinates = PreviewService.addPreviewPadding(detail.cause);
      const [x, y] = this.toComponentCoordinates(coordinates);
      this.elementRepositoryService.addEditorElement(detail.data, x, y);
    }
  }

}
