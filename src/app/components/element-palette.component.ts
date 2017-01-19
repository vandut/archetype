import { Component } from '@angular/core';
import { DragService } from '../services/drag.service';

@Component({
  selector: 'app-element-palette',
  templateUrl: './element-palette.component.html',
  styleUrls: ['./element-palette.component.css']
})
export class ElementPaletteComponent {

  private defaultDivTemplate = '<div style="width: 100px; height: 100px; background: red;">A</div>';

  constructor(private dragService: DragService) {}

  startDrag(event: MouseEvent, template: string) {
    this.dragService.beginDrag(this, template, event);
    event.preventDefault();
  }

}
