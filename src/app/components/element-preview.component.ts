import { Component, ElementRef, HostListener, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HTMLElementChmod } from '../utils/HTMLElement';
import { DragAndDropMessage } from '../utils/DragAndDropMessage';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { MouseMoveEventsMixin, MouseMoveEventsListener } from '../mixins/MouseMoveEventsMixin';

class DraggableElement {

  private draggedElement: HTMLElement;

  constructor(private template: string) {
    this.draggedElement = HTMLElementChmod.fromTemplate(template)
      .positionOnTop()
      .setOpacity(0.25)
      .addClass('cursor_grabbing')
      .done();
  }

  getTemplate(): string {
    return this.template;
  }

  attach(parent: Node) {
    parent.appendChild(this.draggedElement);
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
    HTMLElementChmod.of(this.draggedElement)
      .setCoordinates(offsetX - padding, offsetY - padding);
  }

}

@Component({
  selector: 'app-element-preview',
  template: ``
})
export class ElementPreviewComponent extends BaseDomManipulationComponent implements OnInit, MouseMoveEventsListener {

  private draggableElement: DraggableElement = null;

  @Input()
  private padding: number;

  @Output()
  private onDragStop = new EventEmitter<DragAndDropMessage>();

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnInit() {
    MouseMoveEventsMixin.register(this.getNativeParentElement(), this);
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
      this.draggableElement.moveTo(x, y, this.padding);
    }
  }

  startDrag(message: DragAndDropMessage) {
    if (!this.draggableElement) {
      let [x, y] = this.toParentElementCoordinates(message.coordinates);
      this.draggableElement = new DraggableElement(message.template);
      this.draggableElement.attach(this.getNativeParentElement());
      this.draggableElement.moveTo(x, y, this.padding);
    }
  }

  stopDrag(event: MouseEvent) {
    if (this.draggableElement) {
      this.draggableElement.remove();
      let message = new DragAndDropMessage(event, this.draggableElement.getTemplate());
      this.onDragStop.emit(message);
      this.draggableElement = null;
    }
  }

}
