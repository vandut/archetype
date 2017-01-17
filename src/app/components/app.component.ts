import { Component, ViewChild } from '@angular/core';
import { DragAndDropMessage } from '../utils/DragAndDropMessage';
import { EditorComponent } from './editor.component';
import { ElementPreviewComponent } from './element-preview.component';
import { PageCoordinates } from '../utils/PageCoordinates';
import { InputEventsStrategy, SwitchableInputEventsStrategy, InputEventsStrategyComponent } from './strategy';

declare type ValueProvider<T> = () => T;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends InputEventsStrategyComponent {

  @ViewChild(EditorComponent)
  private editor: EditorComponent;

  @ViewChild(ElementPreviewComponent)
  private elementPreview: ElementPreviewComponent;

  private nopStrategy = new SwitchableInputEventsStrategy();
  private elementPreviewStrategy = new ElementPreviewStrategy(this.nopStrategy, () => this.editor, () => this.elementPreview);

  constructor() {
    super();
    this.registerStrategy(this.nopStrategy);
    this.registerStrategy(this.elementPreviewStrategy);
    this.switchStrategyTo(this.nopStrategy);
  }

  private onPaletteDragStart(message: DragAndDropMessage) {
    this.switchStrategyTo(this.elementPreviewStrategy);
    this.elementPreviewStrategy.startPreview(message.template, message.coordinates);
  }

}

class ElementPreviewStrategy extends SwitchableInputEventsStrategy {

  private static PADDING = 10;

  constructor(private nopStrategy: InputEventsStrategy,
              private editorProvider: ValueProvider<EditorComponent>,
              private elementPreviewProvider: ValueProvider<ElementPreviewComponent>) {
    super();
  }

  private get editor(): EditorComponent {
    return this.editorProvider();
  }

  private get elementPreview(): ElementPreviewComponent {
    return this.elementPreviewProvider();
  }

  startPreview(template: string, coordinates: PageCoordinates) {
    this.editor.clearSelection();
    coordinates = ElementPreviewStrategy.addPaddingToPageCoordinates(coordinates);
    this.elementPreview.createPreview(template, coordinates);
  }

  onLocalMouseEnter(event: MouseEvent): boolean {
    this.elementPreview.showPreview();
    return false;
  }

  onLocalMouseLeave(event: MouseEvent): boolean {
    this.elementPreview.hidePreview();
    return false;
  }

  onLocalMouseMove(event: MouseEvent): boolean {
    this.elementPreview.movePreviewTo(ElementPreviewStrategy.addPaddingToPageCoordinates(event));
    return false;
  }

  onGlobalMouseUp(event: MouseEvent): boolean {
    let template = this.elementPreview.getPreviewTemplate();
    this.elementPreview.removePreview();
    if (this.editor.isPageCoordinatesInside(event)) {
      this.editor.addElement(template, ElementPreviewStrategy.addPaddingToPageCoordinates(event));
    }
    this.switchStrategyTo(this.nopStrategy);
    return false;
  }

  static addPaddingToPageCoordinates(coordinates: PageCoordinates): PageCoordinates {
    return {
      pageX: coordinates.pageX - ElementPreviewStrategy.PADDING,
      pageY: coordinates.pageY - ElementPreviewStrategy.PADDING
    };
  }

}
