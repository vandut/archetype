import { Component, Output, EventEmitter } from '@angular/core';
import { DragAndDropMessage } from '../utils/DragAndDropMessage';

@Component({
  selector: 'app-element-palette',
  templateUrl: './element-palette.component.html',
  styleUrls: ['./element-palette.component.css']
})
export class ElementPaletteComponent {

  private defaultDivTemplate = '<div style="width: 100px; height: 100px; background: red;">A</div>';

  @Output()
  private onDragStart = new EventEmitter<DragAndDropMessage>();

  startDrag(event: MouseEvent, template: string) {
    let message = new DragAndDropMessage(event, template);
    this.onDragStart.emit(message);
    event.preventDefault();
  }

}
