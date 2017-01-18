import { Component, HostListener } from '@angular/core';
import { DragService, DragDetail } from '../services/drag.service';
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

  @HostListener(DragService.BEGIN_EVENT, ['$event.detail'])
  private onDragBegin(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      this.clearSelection();
    }
  }

}
