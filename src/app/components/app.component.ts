import { Component, ViewChild } from '@angular/core';
import { DragAndDropMessage } from '../utils/DragAndDropMessage';
import { EditorComponent } from './editor.component';
import { ElementPreviewComponent } from './element-preview.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild(EditorComponent)
  private editor: EditorComponent;
  @ViewChild(ElementPreviewComponent)
  private dragPreviewInject: ElementPreviewComponent;

  private padding = 10;

  private onDragStart(message: DragAndDropMessage) {
    this.editor.clearSelection();
    this.dragPreviewInject.startDrag(message)
  }

  private onDragStop(message: DragAndDropMessage) {
    if (this.editor.isPageCoordinatesInside(message.coordinates)) {
      let coordinates = {
        pageX: message.coordinates.pageX - this.padding,
        pageY: message.coordinates.pageY - this.padding
      };
      this.editor.addElement(message.template, coordinates);
    }
  }

}
