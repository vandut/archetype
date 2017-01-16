import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { HTMLElementChmod } from '../utils/HTMLElement';
import { Subscription } from 'rxjs/Rx';
import { PageCoordinates } from '../utils/PageCoordinates';
import { DragAndDropService } from '../services/drag-and-drop.service';

class Selection {

  private htmlElement: HTMLElement;

  constructor(private target: HTMLElement,
              private selectionDragStartListener: (d: string, c: PageCoordinates) => void) {
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

  private static shadowBorder(handler: (e: MouseEvent) => void, cursor: string, l: number, r: number, t: number, b: number, w: number, h: number) {
    let element = Selection.box(l, r, t, b, w, h)
      .pointerEvents(true)
      .customStyle(style => {
        style.cursor = cursor;
      })
      .done();
    element.addEventListener('mousedown', handler);
    return element;
  }

  private at(x: number, y: number, w: number, h: number) {
    let oPpadding = 3;
    let iPpadding = 3;
    let corner = 2;
    let rootElement = Selection.borderAll(x, y, w, h, 2);
    rootElement.appendChild(Selection.shadowBorder(this.handler('all'), 'move', iPpadding, iPpadding, iPpadding, iPpadding, null, null));
    rootElement.appendChild(Selection.shadowBorder(this.handler('w'), 'w-resize', -oPpadding, null, 0, 0, oPpadding+iPpadding, null));
    rootElement.appendChild(Selection.shadowBorder(this.handler('e'), 'e-resize', null, -oPpadding, 0, 0, oPpadding+iPpadding, null));
    rootElement.appendChild(Selection.shadowBorder(this.handler('n'), 'n-resize', 0, 0, -oPpadding, null, null, oPpadding+iPpadding));
    rootElement.appendChild(Selection.shadowBorder(this.handler('s'), 's-resize', 0, 0, null, -oPpadding, null, oPpadding+iPpadding));
    rootElement.appendChild(Selection.shadowBorder(this.handler('nw'), 'nw-resize', -oPpadding, null, -oPpadding, null, oPpadding+corner*2, oPpadding+corner*2));
    rootElement.appendChild(Selection.shadowBorder(this.handler('ne'), 'ne-resize', null, -oPpadding, -oPpadding, null, oPpadding+corner*2, oPpadding+corner*2));
    rootElement.appendChild(Selection.shadowBorder(this.handler('sw'), 'sw-resize', -oPpadding, null, null, -oPpadding, oPpadding+corner*2, oPpadding+corner*2));
    rootElement.appendChild(Selection.shadowBorder(this.handler('se'), 'se-resize', null, -oPpadding, null, -oPpadding, oPpadding+corner*2, oPpadding+corner*2));
    return rootElement;
  }

  private handler(direction: string) {
    return event => {
      event.preventDefault();
      this.handleSelection(direction, event);
    }
  }

  private handleSelection(direction: string, coordinates: PageCoordinates) {
    this.selectionDragStartListener(direction, coordinates);
  }

  attach(element: HTMLElement) {
    element.appendChild(this.htmlElement);
  }

  remove() {
    this.htmlElement.remove();
  }
}

@Component({
  selector: 'app-selection-layer',
  template: ``
})
export class SelectionLayerComponent extends BaseDomManipulationComponent implements OnInit, OnDestroy {

  private dragStartedSubscription: Subscription;
  private selection: Selection = null;

  constructor(private dragAndDropService: DragAndDropService,
              elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnInit() {
    this.dragStartedSubscription = this.dragAndDropService.dragStart.subscribe(m => this.clearSelection());
  }

  ngOnDestroy() {
    this.dragStartedSubscription.unsubscribe();
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

  private selectionDragStarted(direction: string, coordinates: PageCoordinates) {
    console.log(direction, coordinates);
  }

}
