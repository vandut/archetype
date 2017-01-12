import { Component } from '@angular/core';
import { DragAndDropService, DragAndDropMessage } from '../services/drag-and-drop.service';

@Component({
  selector: 'app-elements-pallete',
  templateUrl: './elements-pallete.component.html',
  styleUrls: ['./elements-pallete.component.css']
})
export class ElementsPalleteComponent {

  private defaultDivTemplate = '<div style="width: 100px; height: 100px; background: red;">A</div>';

  constructor(private dragAndDropService: DragAndDropService) {
  }

  startDrag(event: MouseEvent, template: string) {
    this.dragAndDropService.dragStart.emit(new DragAndDropMessage(event, template));
    event.preventDefault();
  }

}
