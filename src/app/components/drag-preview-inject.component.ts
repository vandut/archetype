import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { HTMLElementWrapper } from "../utils/HTMLElementWrapper"
import { DragAndDropService, DragAndDropMessage } from "../services/drag-and-drop.service"
import { Subscription } from 'rxjs/Rx';
import { BaseDomManipulationComponent } from "./base-dom-manipulation.component"

@Component({
  selector: 'app-drag-preview-inject',
  template: ``
})
export class DragPreviewInjectComponent extends BaseDomManipulationComponent implements OnInit, OnDestroy {

  private template = '';
  private draggedElement: HTMLElementWrapper = undefined;
  private mouseInsideFlag: boolean = false;
  private dragActiveFlag: boolean = false;

  private dragStartSubscription: Subscription = undefined;

  constructor(
    private dragAndDropService: DragAndDropService,
    elementRef: ElementRef) {
      super(elementRef);
  }

  ngOnInit() {
    this.dragStartSubscription = this.dragAndDropService.dragStart.subscribe(
      message => this.startDrag(message.event, message.template)
    );
  }

  ngOnDestroy() {
    this.dragStartSubscription.unsubscribe();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isEventTargetInsideParent(event.target)) {
      if (!this.mouseInsideFlag) {
        this.mouseInsideFlag = true;
        this.onMouseEntered(event);
      } else {
        this.onMouseMoveInside(event);
      }
    } else {
      if (this.mouseInsideFlag) {
        this.mouseInsideFlag = false;
        this.onMouseLeft(event);
      }
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.stopDrag(event);
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

  private onMouseEntered(event: MouseEvent) {
    if (this.dragActiveFlag) {
      this.spawnElement();
      let [x, y] = this.toParentElementCoordinates(event);
      this.moveElementTo(x, y);
      event.preventDefault();
    }
  }

  private onMouseLeft(event: MouseEvent) {
    if (this.dragActiveFlag) {
      this.destroyElement();
      event.preventDefault();
    }
  }

  private onMouseMoveInside(event: MouseEvent) {
    if (this.dragActiveFlag) {
      let [x, y] = this.toParentElementCoordinates(event);
      this.moveElementTo(x, y);
      event.preventDefault();
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
