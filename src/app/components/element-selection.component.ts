import { Component, ElementRef } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { HTMLElementChmod } from '../utils/HTMLElement';
import { PageCoordinates } from '../utils/PageCoordinates';

class Selection {

  private htmlElement: HTMLElement;

  constructor(private target: HTMLElement,
              private selectionDragStartListener: (d: string, c: PageCoordinates) => boolean) {
    this.htmlElement = this.at(target.offsetLeft, target.offsetTop, target.clientWidth, target.clientHeight);
  }

  private static box(l: number, r: number, t: number, b: number, w: number, h: number) {
    return HTMLElementChmod.fromDiv()
      .customStyle(style => {
        style.position = 'absolute';
      })
      .custom(element => {
        element.left = l;
        element.right = r;
        element.top = t;
        element.bottom = b;
        element.width = w;
        element.height = h;
      });
  }

  private static borderAll(x: number, y: number, w: number, h: number, padding: number) {
    return Selection.box(x, null, y, null, w, h)
      .pointerEvents(false)
      .customStyle(style => {
        style.outline = `${padding}px dashed black`;
        style.boxShadow = `0 0 0 ${padding}px white`;
      })
      .done();
  }

  private static boxSegment(handler: (e: MouseEvent) => boolean, cursor: string, l: number, r: number, t: number, b: number, w: number, h: number): HTMLElementChmod {
    return Selection.box(l, r, t, b, w, h)
      .pointerEvents(true)
      .customStyle(style => {
        style.cursor = cursor;
      })
      .eventListener('mousedown', handler);
  }

  private at(x: number, y: number, w: number, h: number) {
    let oPpadding = 3;
    let iPpadding = 3;
    let corner = 2;
    let rootElement = Selection.borderAll(x, y, w, h, 2);
    rootElement.appendChild(
      Selection.boxSegment(this.handler('all'), 'move', 0, 0, 0, 0, null, null)
        .customStyle(style => {
          style.background = 'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1) 10px, rgba(255, 255, 255, 0.1) 10px, rgba(255, 255, 255, 0.1) 20px)';
        })
        .done()
    );
    rootElement.appendChild(Selection.boxSegment(this.handler('w'), 'w-resize', -oPpadding, null, 0, 0, oPpadding+iPpadding, null).done());
    rootElement.appendChild(Selection.boxSegment(this.handler('e'), 'e-resize', null, -oPpadding, 0, 0, oPpadding+iPpadding, null).done());
    rootElement.appendChild(Selection.boxSegment(this.handler('n'), 'n-resize', 0, 0, -oPpadding, null, null, oPpadding+iPpadding).done());
    rootElement.appendChild(Selection.boxSegment(this.handler('s'), 's-resize', 0, 0, null, -oPpadding, null, oPpadding+iPpadding).done());
    rootElement.appendChild(Selection.boxSegment(this.handler('nw'), 'nw-resize', -oPpadding, null, -oPpadding, null, oPpadding+corner*2, oPpadding+corner*2).done());
    rootElement.appendChild(Selection.boxSegment(this.handler('ne'), 'ne-resize', null, -oPpadding, -oPpadding, null, oPpadding+corner*2, oPpadding+corner*2).done());
    rootElement.appendChild(Selection.boxSegment(this.handler('sw'), 'sw-resize', -oPpadding, null, null, -oPpadding, oPpadding+corner*2, oPpadding+corner*2).done());
    rootElement.appendChild(Selection.boxSegment(this.handler('se'), 'se-resize', null, -oPpadding, null, -oPpadding, oPpadding+corner*2, oPpadding+corner*2).done());
    return rootElement;
  }

  private handler(direction: string) {
    return event => {
      event.preventDefault();
      return this.handleSelection(direction, event);
    }
  }

  private handleSelection(direction: string, coordinates: PageCoordinates): boolean {
    return this.selectionDragStartListener(direction, coordinates);
  }

  attach(element: HTMLElement) {
    element.appendChild(this.htmlElement);
  }

  remove() {
    this.htmlElement.remove();
  }
}

@Component({
  selector: 'app-element-selection',
  template: ``
})
export class ElementSelectionComponent extends BaseDomManipulationComponent {

  private selection: Selection = null;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  public selectTarget(target: HTMLElement) {
    this.clearSelection();
    if (target) {
      this.selection = new Selection(target, (d, c) => this.selectionDragStarted(d, c));
      this.selection.attach(this.getNativeElement());
    }
  }

  public clearSelection() {
    if (this.selection) {
      this.selection.remove();
      this.selection = null;
    }
  }

  private selectionDragStarted(direction: string, coordinates: PageCoordinates): boolean {
    console.log(direction, coordinates);
    return true;
  }

}
