import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { HTMLElementWrapper } from "../utils/HTMLElementWrapper"
import { DragAndDropService, DragAndDropMessage } from "../services/drag-and-drop.service"
import { SelectionService } from "../services/selection.service"
import { BaseDomManipulationComponent } from "./base-dom-manipulation.component"

@Component({
  selector: 'app-elements-container',
  template: `<div></div>`,
  styles: [ `div {position: absolute; width: 100%; height: 100%}` ]
})
export class ElementsContainerComponent extends BaseDomManipulationComponent implements OnInit, OnDestroy {

  private static MANAGED_CSS_CLASS = 'archetype_managed';

  private dragStopSubscription: Subscription = undefined;

  constructor(
    private dragAndDropService: DragAndDropService,
    private selectionService: SelectionService,
    elementRef: ElementRef) {
      super(elementRef);
  }

  ngOnInit() {
    this.dragStopSubscription = this.dragAndDropService.dragStop.subscribe(
      message => this.stopDrag(message.event, message.template)
    );
  }

  ngOnDestroy() {
    this.dragStopSubscription.unsubscribe();
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (this.isEventTargetInsideComponent(event)) {
      let target: HTMLElement = <HTMLElement> event.target;
      if (target.classList.contains(ElementsContainerComponent.MANAGED_CSS_CLASS)) {
        this.selectionService.selected.emit(target);
      } else {
        this.selectionService.selected.emit(null);
      }
    }
  }

  stopDrag(event: MouseEvent, template: string) {
    if (this.isMouseEventInsideComponent(event)) {
      let el = HTMLElementWrapper.fromTemplate(template);
      let [x, y] = this.toComponentCoordinates(event);
      let padding = this.dragAndDropService.dragPadding;
      el.setAbsolutePosition(x - padding, y - padding);
      el.addClass(ElementsContainerComponent.MANAGED_CSS_CLASS);
      el.appendAsChildOf(this.getNativeElement());
    }
  }

}
