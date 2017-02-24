import { Component } from '@angular/core';
import { DragService } from '../services/drag.service';
import { ElementSelectionService } from '../services/element-selection.service';

@Component({
  selector: 'app-element-palette',
  templateUrl: './element-palette.component.html',
  styleUrls: ['./element-palette.component.css']
})
export class ElementPaletteComponent {

  public static DEFAULT_DIV_TEMPLATE = '<div style="width: 100px; height: 100px; background: red;">A</div>';

  private defaultDivTemplate = ElementPaletteComponent.DEFAULT_DIV_TEMPLATE;

  constructor(
    private dragService: DragService,
    private elementSelectionService: ElementSelectionService) {}

  startDrag(event: MouseEvent, template: string) {
    if (event.button === 0) {
      this.dragService.beginDrag(this, template, event);
      this.elementSelectionService.clearSelection();
      event.preventDefault();
    }
  }

}
