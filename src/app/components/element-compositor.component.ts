import { Component, ElementRef, EventEmitter, Output, HostListener } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { HTMLElementChmod } from '../utils/HTMLElement';
import { PageCoordinates } from '../utils/PageCoordinates';
import { ElementRepositoryService, EditorElement } from '../services/element-repository.service';

@Component({
  selector: 'app-element-compositor',
  template: ``
})
export class ElementCompositorComponent extends BaseDomManipulationComponent {

  @Output()
  public onSelected = new EventEmitter<HTMLElement>();

  constructor(elementRef: ElementRef, private elementRepositoryService: ElementRepositoryService) {
    super(elementRef);
  }

  @HostListener('document:mousedown', ['$event'])
  public onMouseDown(event: MouseEvent) {
    if (this.isEventTargetInsideComponent(event.target) && !event.ctrlKey) {
      const target: HTMLElement = <HTMLElement> event.target;
      if (target.dataset[ElementRepositoryService.ID_DATA_ATTR_NAME]) {
        this.onSelected.emit(target);
      } else {
        this.onSelected.emit(null);
      }
      if (event.target !== this.getNativeElement()) {
        event.preventDefault();
      }
    }
  }

  addElement(template: string, coordinates: PageCoordinates): EditorElement {
    const editorElement: EditorElement = this.elementRepositoryService.addEditorElement(template);

    const [x, y] = this.toComponentCoordinates(coordinates);
    HTMLElementChmod.of(editorElement.htmlDom)
      .applyTransformation(t => {
        t.positionType = 'absolute';
        t.positionX = x;
        t.positionY = y;
      });
    this.getNativeElement().appendChild(editorElement.htmlDom);

    return editorElement;
  }

}
