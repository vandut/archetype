import { Component } from '@angular/core';
import { ElementSelectionService } from '../services/element-selection.service';
import { DraggableDirective } from '../directives/draggable.directive';
import { PreviewService } from '../services/preview.service';
import { HTMLElementFactory } from '../utils/HTMLElement';

@Component({
  selector: 'app-element-palette',
  templateUrl: './element-palette.component.html',
  styleUrls: ['./element-palette.component.css']
})
export class ElementPaletteComponent {

  public static DEFAULT_DIV_TEMPLATE = '<div style="width: 100px; height: 100px; background: red;">A</div>';

  private items = [
    {
      name: 'Stub element',
      template: ElementPaletteComponent.DEFAULT_DIV_TEMPLATE
    }
  ];

  constructor(
    private elementSelectionService: ElementSelectionService,
    private previewService: PreviewService) {}

  onPreviewStart(event: HammerInput, template: string) {
    const target = HTMLElementFactory.fromTemplate(template);
    this.previewService.startPreview(target, DraggableDirective.hammerPoint2Coordinates(event.center));
    this.elementSelectionService.clearSelection();
  }

}
