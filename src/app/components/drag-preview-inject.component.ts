import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { HTMLElementWrapper } from '../utils/HTMLElementWrapper';
import { DragAndDropService, DragAndDropMessage } from '../services/drag-and-drop.service';
import { Subscription } from 'rxjs/Rx';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { MouseMoveEventsMixin, MouseMoveEventsListener } from '../mixins/MouseMoveEventsMixin';

class DraggableElement {

  private constructor(private draggedElement: HTMLElementWrapper,
                      private template: string) {}

  static fromTemplate(template: string) {
    let element = HTMLElementWrapper.fromTemplate(template);
    element.positionOnTop();
    element.setOpacity(0.25);
    element.addClass('cursor_grabbing');
    return new DraggableElement(element, template);
  }

  getWrappedDeprecated(): HTMLElementWrapper {
    return this.draggedElement;
  }

  getTemplate(): string {
    return this.template;
  }

  attach(parent: Node) {
    this.draggedElement.appendAsChildOf(parent);
  }

  remove() {
    this.draggedElement.remove();
  }

  show() {
    this.draggedElement.style.visibility = null;
  }

  hide() {
    this.draggedElement.style.visibility = 'hidden';
  }

  moveTo(offsetX: number, offsetY: number, padding: number) {
    this.draggedElement.moveTo(offsetX - padding, offsetY - padding);
  }

}

@Component({
  selector: 'app-drag-preview-inject',
  template: ``
})
export class DragPreviewInjectComponent extends BaseDomManipulationComponent implements OnInit, OnDestroy, MouseMoveEventsListener {

  private subscription: Subscription;
  private draggableElement: DraggableElement = null;

  constructor(private dragAndDropService: DragAndDropService,
              elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnInit() {
    MouseMoveEventsMixin.register(this.getNativeParentElement(), this);
    this.subscription = this.dragAndDropService.dragStart.subscribe(m => this.startDrag(m));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.stopDrag(event);
  }

  onMouseEntered(event: MouseEvent) {
    if (this.draggableElement) {
      this.draggableElement.show();
    }
  }

  onMouseLeft(event: MouseEvent) {
    if (this.draggableElement) {
      this.draggableElement.hide();
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.draggableElement) {
      let [x, y] = this.toParentElementCoordinates(event);
      this.draggableElement.moveTo(x, y, this.dragAndDropService.padding);
    }
  }

  startDrag(message: DragAndDropMessage) {
    if (!this.draggableElement) {
      this.draggableElement = DraggableElement.fromTemplate(message.template);
      this.draggableElement.attach(this.getNativeParentElement());
      let [x, y] = this.toParentElementCoordinates(message.event);
      this.draggableElement.moveTo(x, y, this.dragAndDropService.padding);
    }
  }

  stopDrag(event: MouseEvent) {
    if (this.draggableElement) {
      this.draggableElement.remove();
      this.dragAndDropService.dragStop.emit(new DragAndDropMessage(event, this.draggableElement.getTemplate()));
      this.draggableElement = null;
    }
  }

}
