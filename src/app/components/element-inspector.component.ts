import { Component, Input, HostListener } from '@angular/core';
import { DragEventNames, DragDetail } from '../services/drag.service';
import { ElementPaletteComponent } from './element-palette.component';

@Component({
  selector: 'app-element-inspector',
  templateUrl: './element-inspector.component.html',
  styleUrls: ['./element-inspector.component.css']
})
export class ElementInspectorComponent {

  private selectedElement: HTMLElement = null;

  private enabledProperties = [
    'position', 'width', 'height', 'left', 'right', 'top', 'bottom'
  ];

  @Input()
  private selected: HTMLElement = null;

  selectElement(element: HTMLElement) {
    this.selectedElement = element;
  }

  @HostListener(DragEventNames.RECEIVE_BEGIN, ['$event.detail'])
  private onDragBegin(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      this.selectElement(null);
    }
  }

}
