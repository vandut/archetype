import { Component, Input, HostListener } from '@angular/core';
import { DragEventNames, DragDetail } from '../services/drag.service';
import { ElementPaletteComponent } from './element-palette.component';

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

  public selectedElement: HTMLElement = null;

  public enabledProperties: PropertyBinding[] = [
    { id: 'left', name: 'Position left' },
    { id: 'top', name: 'Position top' },
    { id: 'width', name: 'Total width' },
    { id: 'height', name: 'Total height' },
  ];

  @Input()
  public selected: HTMLElement = null;

  public selectElement(element: HTMLElement) {
    this.selectedElement = element;
  }

  @HostListener(DragEventNames.RECEIVE_BEGIN, ['$event.detail'])
  public onDragBegin(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      this.selectElement(null);
    }
  }

}
