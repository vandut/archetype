import { Component } from '@angular/core';
import { ElementSelectionService } from '../../services/element-selection.service';
import { PreviewService } from '../../../drag/preview.service';
import { HTMLElementFactory } from '../../../shared/HTMLElement';
import { PreviewDirective } from '../../../drag/preview.directive';

@Component({
  selector: 'palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.css']
})
export class PaletteComponent {

  public static DEFAULT_DIV_TEMPLATE = '<div style="width: 100px; height: 100px; background: red;">A</div>';

  private items = [
    {
      name: 'Stub element',
      template: PaletteComponent.DEFAULT_DIV_TEMPLATE
    }
  ];

  constructor(
    private elementSelectionService: ElementSelectionService,
    private previewService: PreviewService) {}

  onPreviewStart(event: HammerInput, template: string) {
    const target = HTMLElementFactory.fromTemplate(template);
    this.previewService.startPreview(target, PreviewDirective.hammerPoint2Coordinates(event.center));
    this.elementSelectionService.clearSelection();
  }

}
