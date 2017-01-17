import { Component, ViewChild, HostListener } from '@angular/core';
import { DragAndDropMessage } from '../utils/DragAndDropMessage';
import { EditorComponent } from './editor.component';
import { ElementPreviewComponent } from './element-preview.component';
import { PageCoordinates } from '../utils/PageCoordinates';

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

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    if (this.dragPreviewInject.isPreviewActive()) {
      this.dragPreviewInject.showPreview();
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    if (this.dragPreviewInject.isPreviewActive()) {
      this.dragPreviewInject.hidePreview();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dragPreviewInject.isPreviewActive()) {
      this.dragPreviewInject.movePreviewTo(this.addPaddingToPageCoordinates(event));
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.dragPreviewInject.isPreviewActive()) {
      let template = this.dragPreviewInject.getPreviewTemplate();
      this.dragPreviewInject.removePreview();
      this.addElementToEditor(template, event);
    }
  }

  private onPaletteDragStart(message: DragAndDropMessage) {
    this.editor.clearSelection();
    let coordinates = this.addPaddingToPageCoordinates(message.coordinates);
    this.dragPreviewInject.createPreview(message.template, coordinates);
  }

  private addElementToEditor(template: string, coordinates: PageCoordinates) {
    if (this.editor.isPageCoordinatesInside(coordinates)) {
      this.editor.addElement(template, this.addPaddingToPageCoordinates(coordinates));
    }
  }

  addPaddingToPageCoordinates(coordinates: PageCoordinates): PageCoordinates {
    return {
      pageX: coordinates.pageX - this.padding,
      pageY: coordinates.pageY - this.padding
    };
  }

}
