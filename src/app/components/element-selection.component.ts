import { Component, HostListener } from '@angular/core';
import { DragDetail, DragEventNames } from '../services/drag.service';
import { ElementPaletteComponent } from './element-palette.component';

@Component({
  selector: 'app-element-selection',
  templateUrl: './element-selection.component.html'
})
export class ElementSelectionComponent {

  private selectedElements: HTMLElement[] = [];

  public selectTarget(target: HTMLElement) {
    this.clearSelection();
    if (target) {
      this.selectedElements.push(target);
    }
  }

  public clearSelection() {
    this.selectedElements.pop();
  }

  @HostListener(DragEventNames.RECEIVE_BEGIN, ['$event.detail'])
  private onDragBegin(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      this.clearSelection();
    }
  }

}
