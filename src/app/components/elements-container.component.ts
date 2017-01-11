import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { HTMLElementWrapper } from "../utils/HTMLElementWrapper"
import { DragAndDropService, DragAndDropMessage } from "../services/drag-and-drop.service"
import { SelectionService } from "../services/selection.service"
import { BaseDomManipulationComponent } from "./base-dom-manipulation.component"

@Component({
  selector: 'app-elements-container',
  template: ``
})
export class ElementsContainerComponent extends BaseDomManipulationComponent implements OnInit, OnDestroy {

  private static MANAGED_CSS_CLASS = 'archetype_managed';

  private subscription: Subscription;

  constructor(
    private dragAndDropService: DragAndDropService,
    private selectionService: SelectionService,
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
    if (this.isEventTargetInsideComponent(event.target)) {
      let target: HTMLElement = <HTMLElement> event.target;
      if (target.classList.contains(ElementsContainerComponent.MANAGED_CSS_CLASS)) {
        this.selectionService.selected.emit(target);
      } else {
        this.selectionService.selected.emit(null);
      }
    }
  }

  stopDrag(message: DragAndDropMessage) {
    if (this.isPageCoordinatesInsideComponent(message.event)) {
      let el = HTMLElementWrapper.fromTemplate(message.template);
      let [x, y] = this.toComponentCoordinates(message.event);
      let padding = this.dragAndDropService.padding;
      el.setAbsolutePosition(x - padding, y - padding);
      el.addClass(ElementsContainerComponent.MANAGED_CSS_CLASS);
      el.appendAsChildOf(this.getNativeElement());
    }
  }

}
