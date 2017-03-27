import { Component } from '@angular/core';
import { ElementSelectionService } from '../../services/element-selection.service';
import { PreviewService } from '../../../drag/preview.service';
import { HTMLElementFactory } from '../../../shared/HTMLElement';
import { DraggableItemService } from '../../../drag/draggable-item.service';

@Component({
  selector: 'palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.css']
})
export class PaletteComponent {

  public static DEFAULT_DIV_TEMPLATE = '<div style="width: 100px; height: 100px; background: red;">A</div>';

  public items = [
    {
      name: 'Stub element',
      template: PaletteComponent.DEFAULT_DIV_TEMPLATE
    }
  ];

  constructor(
    private elementSelectionService: ElementSelectionService,
    private previewService: PreviewService,
    private draggableItemService: DraggableItemService) {}

  onPreviewStart(event: HammerInput, template: string) {
    const target = HTMLElementFactory.fromTemplate(template);
    const draggableItem = this.draggableItemService.copyDraggableItem(target);
    this.previewService.onPanStart(draggableItem, event.center);
    this.elementSelectionService.clearSelection();
  }

}
