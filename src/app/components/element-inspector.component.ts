import { Component, Input, HostListener } from '@angular/core';
import { DragEventNames, DragDetail } from '../services/drag.service';
import { ElementPaletteComponent } from './element-palette.component';
import { HTMLElementTransformer } from '../utils/HTMLElement';

interface PropertyBinding {
  id: string;
  name: string;
}

@Component({
  selector: 'app-element-inspector',
  templateUrl: './element-inspector.component.html',
  styleUrls: ['./element-inspector.component.css']
})
export class ElementInspectorComponent {

  public selectedElement: HTMLElementTransformer = null;

  public enabledPositionTypes: PropertyBinding[] = [
    { id: 'absolute', name: 'Absolute' },
  ];
  public enabledProperties: PropertyBinding[] = [
    { id: 'positionX', name: 'Position left' },
    { id: 'positionY', name: 'Position top' },
    { id: 'totalWidth', name: 'Total width' },
    { id: 'totalHeight', name: 'Total height' },
  ];

  @Input()
  public selected: HTMLElement = null;

  public selectElement(element: HTMLElement) {
    this.selectedElement = element ? HTMLElementTransformer.of(element) : null;
  }

  @HostListener(DragEventNames.RECEIVE_BEGIN, ['$event.detail'])
  public onDragBegin(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      this.selectElement(null);
    }
  }

}
