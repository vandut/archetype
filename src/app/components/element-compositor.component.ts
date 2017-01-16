import { Component, ElementRef, HostListener, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { HTMLElementChmod } from '../utils/HTMLElement';
import { DragAndDropService, DragAndDropMessage } from '../services/drag-and-drop.service';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';

@Component({
  selector: 'app-element-compositor',
  template: ``
})
export class ElementCompositorComponent extends BaseDomManipulationComponent implements OnInit, OnDestroy {

  private static MANAGED_CSS_CLASS = 'archetype_managed';

  private subscription: Subscription;

  @Output()
  private onSelected = new EventEmitter<HTMLElement>();

  constructor(private dragAndDropService: DragAndDropService,
              elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnInit() {
    this.subscription = this.dragAndDropService.dragStop.subscribe(m => this.stopDrag(m));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (this.isEventTargetInsideComponent(event.target) && !event.ctrlKey) {
      let target: HTMLElement = <HTMLElement> event.target;
      if (target.classList.contains(ElementCompositorComponent.MANAGED_CSS_CLASS)) {
        this.onSelected.emit(target);
      } else {
        this.onSelected.emit(null);
      }
      if (event.target !== this.getNativeElement()) {
        event.preventDefault();
      }
    }
  }

  stopDrag(message: DragAndDropMessage) {
    if (this.isPageCoordinatesInsideComponent(message.coordinates)) {
      let [x, y] = this.toComponentCoordinates(message.coordinates);
      let padding = this.dragAndDropService.padding;

      let element = HTMLElementChmod.fromTemplate(message.template)
        .setAbsoluteCoordinates(x - padding, y - padding)
        .addClass(ElementCompositorComponent.MANAGED_CSS_CLASS)
        .done();

      this.getNativeElement().appendChild(element);
    }
  }

}
