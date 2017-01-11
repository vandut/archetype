import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { HTMLElementWrapper } from "../utils/HTMLElementWrapper"
import { DragAndDropService, DragAndDropMessage } from "../services/drag-and-drop.service"
import { SelectionService } from "../services/selection.service"

@Component({
  selector: 'app-elements-container',
  template: `<div></div>`,
  styles: [ `div {position: absolute; width: 100%; height: 100%}` ]
})
export class ElementsContainerComponent implements OnInit, OnDestroy {

  private static MANAGED_CSS_CLASS = 'archetype_managed';

  private dragStopSubscription: Subscription = undefined;

  constructor(
    private elementRef: ElementRef,
    private dragAndDropService: DragAndDropService,
    private selectionService: SelectionService) {}

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
    if (this.isPartOfElement(event)) {
      let target: HTMLElement = <HTMLElement> event.target;
      if (target.classList.contains(ElementsContainerComponent.MANAGED_CSS_CLASS)) {
        this.selectionService.selected.emit(target);
      } else {
        this.selectionService.selected.emit(null);
      }
    }
  }

  stopDrag(event: MouseEvent, template: string) {
    if (this.isInsideElement(event)) {
      let [x, y] = this.translateToLocalCoordinates(event);
      let el = HTMLElementWrapper.fromTemplate(template);
      el.setAbsolutePosition(x, y);
      el.addClass(ElementsContainerComponent.MANAGED_CSS_CLASS);
      el.appendAsChildOf(this.getNativeElement());
    }
  }

  translateToLocalCoordinates(event: MouseEvent): [number, number] {
    let rect = this.getNativeElement().getBoundingClientRect();
    return [
      event.pageX - rect.left - this.dragAndDropService.dragPadding,
      event.pageY - rect.top - this.dragAndDropService.dragPadding
    ];
  }
  
  getNativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  isInsideElement(event: MouseEvent): boolean {
    let rect = this.getNativeElement().getBoundingClientRect();
    return event.pageX >= rect.left && event.pageX <= rect.right
        && event.pageY >= rect.top && event.pageY <= rect.bottom;
  }

  private isPartOfElement(event: MouseEvent): boolean {
    return this.getNativeElement().contains(<Node> event.target);
  }

}
