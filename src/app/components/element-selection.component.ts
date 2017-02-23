import { Component, HostListener } from '@angular/core';
import { DragDetail, DragEventNames } from '../services/drag.service';
import { ElementPaletteComponent } from './element-palette.component';
import { ElementRepositoryService } from '../services/element-repository.service';

@Component({
  selector: 'app-element-selection',
  templateUrl: './element-selection.component.html'
})
export class ElementSelectionComponent {

  private selectedElements: HTMLElement[] = [];

  constructor(private elementRepositoryService: ElementRepositoryService) {}

  public selectTarget(editorElementId: string) {
    this.clearSelection();
    const target = this.elementRepositoryService.getEditorElement(editorElementId);
    if (target) {
      this.selectedElements.push(target.htmlDom);
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
