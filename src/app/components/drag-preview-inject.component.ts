import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { HTMLElementWrapper } from "../utils/HTMLElementWrapper"
import { DragAndDropService, DragAndDropMessage } from "../services/drag-and-drop.service"
import { Subscription } from 'rxjs/Rx';
import { BaseDomManipulationComponent } from "./base-dom-manipulation.component"
import { MouseMoveEventsMixin, MouseMoveEventsListener } from "../mixins/MouseMoveEventsMixin"

@Component({
  selector: 'app-drag-preview-inject',
  template: ``
})
export class DragPreviewInjectComponent extends BaseDomManipulationComponent implements OnInit, OnDestroy, MouseMoveEventsListener {

  private template = '';
  private draggedElement: HTMLElementWrapper = undefined;
  private dragActiveFlag: boolean = false;

  private dragStartSubscription: Subscription = undefined;

  constructor(
    private dragAndDropService: DragAndDropService,
    elementRef: ElementRef) {
      super(elementRef);
  }

  ngOnInit() {
    MouseMoveEventsMixin.register(this.getNativeParentElement(), this);
    this.dragStartSubscription = this.dragAndDropService.dragStart.subscribe(
      message => this.startDrag(message.event, message.template)
    );
  }

  ngOnDestroy() {
    this.dragStartSubscription.unsubscribe();
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.stopDrag(event);
  }

  onMouseEntered(event: MouseEvent) {
    if (this.dragActiveFlag) {
      this.spawnElement();
      let [x, y] = this.toParentElementCoordinates(event);
      this.moveElementTo(x, y);
      event.preventDefault();
    }
  }

  onMouseLeft(event: MouseEvent) {
    if (this.dragActiveFlag) {
      this.destroyElement();
      event.preventDefault();
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.dragActiveFlag) {
      let [x, y] = this.toParentElementCoordinates(event);
      this.moveElementTo(x, y);
      event.preventDefault();
    }
  }

  startDrag(event: MouseEvent, template: string) {
    if (!this.dragActiveFlag) {
      this.template = template;
      this.spawnElement();
      let [x, y] = this.toParentElementCoordinates(event);
      this.moveElementTo(x, y);
      this.dragActiveFlag = true;
    }
  }

  stopDrag(event: MouseEvent) {
    if (this.dragActiveFlag) {
      this.dragActiveFlag = false;
      this.destroyElement();
      this.dragAndDropService.dragStop.emit(new DragAndDropMessage(event, this.template));
    }
  }

  private moveElementTo(x: number, y: number) {
    x -= this.dragAndDropService.dragPadding;
    y -= this.dragAndDropService.dragPadding;
    this.draggedElement.moveTo(x, y);
  }

  private spawnElement() {
    this.draggedElement = this.createElement();
    this.draggedElement.appendAsChildOf(this.getNativeParentElement());
  }

  private destroyElement() {
    if (this.draggedElement !== undefined) {
      this.draggedElement.remove();
      this.draggedElement = undefined;
    }
  }

  private createElement(): HTMLElementWrapper {
    let el = HTMLElementWrapper.fromTemplate(this.template)
    el.positionOnTop();
    el.setOpacity(0.25);
    el.addClass('cursor_grabbing');
    return el;
  }

  private isDraggedElementPresent(): boolean {
    return this.draggedElement !== undefined;
  }

}
