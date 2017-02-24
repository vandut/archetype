import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { ElementRepositoryService } from '../services/element-repository.service';
import { ElementSelectionService } from '../services/element-selection.service';
import { ElementPreviewComponent } from './element-preview.component';
import { ElementPaletteComponent } from './element-palette.component';
import { DragDetail, DragEventNames } from '../services/drag.service';
import { SelectionDragMessage } from './selection.component';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-element-compositor',
  template: ``
})
export class ElementCompositorComponent extends BaseDomManipulationComponent implements OnInit, OnDestroy {

  private subscription: Subscription = null;

  constructor(
    elementRef: ElementRef,
    private elementRepositoryService: ElementRepositoryService,
    private elementSelectionService: ElementSelectionService)
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

  @HostListener('document:mousedown', ['$event'])
  public onMouseDown(event: MouseEvent) {
    if (this.isEventTargetInsideComponent(event.target) && !event.ctrlKey) {
      const target: HTMLElement = <HTMLElement> event.target;
      this.elementSelectionService.select(target.dataset[ElementRepositoryService.ID_DATA_ATTR_NAME]);
      if (event.target !== this.getNativeElement()) {
        event.preventDefault();
      }
    }
  }

  @HostListener(DragEventNames.RECEIVE_END, ['$event.detail'])
  public onDragEnd(detail: DragDetail<any | SelectionDragMessage, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent && this.isPageCoordinatesInsideComponent(detail.cause)) {
      let coordinates = ElementPreviewComponent.addPaddingToPageCoordinates(detail.cause);
      const [x, y] = this.toComponentCoordinates(coordinates);
      this.elementRepositoryService.addEditorElement(detail.data, x, y);
    }
  }

}
