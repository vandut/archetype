import { Component, Output, EventEmitter } from '@angular/core';
import { SelectionMessage } from './selection.component';

@Component({
  selector: 'app-element-selection',
  templateUrl: './element-selection.component.html'
})
export class ElementSelectionComponent {

  private selectedElements: HTMLElement[] = [];

  @Output()
  private dragStarted = new EventEmitter<SelectionMessage>();

  public selectTarget(target: HTMLElement) {
    this.clearSelection();
    if (target) {
      this.selectedElements.push(target);
    }
  }

  public clearSelection() {
    this.selectedElements.pop();
  }

  private onDragStarted(message: SelectionMessage) {
    this.dragStarted.emit(message);
  }

}
