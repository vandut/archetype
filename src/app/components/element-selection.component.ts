import { Component, ElementRef } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { PageCoordinates } from '../utils/PageCoordinates';
import { ElementSelection, ElementSelectionEventType } from './selection';

@Component({
  selector: 'app-element-selection',
  template: ``
})
export class ElementSelectionComponent extends BaseDomManipulationComponent {

  private selection: ElementSelection = null;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  public selectTarget(target: HTMLElement) {
    this.clearSelection();
    if (target) {
      this.selection = new ElementSelection(target, (t, d, c) => this.selectionDragStarted(t, d, c));
      this.selection.attach(this.getNativeElement());
    }
  }

  public clearSelection() {
    if (this.selection) {
      this.selection.remove();
      this.selection = null;
    }
  }

  private selectionDragStarted(target: HTMLElement, type: ElementSelectionEventType, coordinates: PageCoordinates): boolean {
    console.log(target);
    console.log(type, coordinates);
    return true;
  }

}
