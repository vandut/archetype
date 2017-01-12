import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { SelectionService } from '../services/selection.service';
import { HTMLElementChmod } from '../utils/HTMLElement';
import { Subscription } from 'rxjs/Rx';

class Selection {

  private constructor(private htmlElement: HTMLElement) {}

  static fromElement(element: HTMLElement) {
    return Selection.at(element.offsetLeft, element.offsetTop,
      element.clientWidth, element.clientHeight);
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

  private static shadowBorder(cursor: string, l: number, r: number, t: number, b: number, w: number, h: number) {
    return Selection.box(l, r, t, b, w, h)
      .pointerEvents(true)
      .customStyle(style => {
        style.cursor = cursor;
      })
      .done();
  }

  private static at(x: number, y: number, w: number, h: number) {
    let oPpadding = 3;
    let iPpadding = 3;
    let corner = 2;
    let rootElement = Selection.borderAll(x, y, w, h, 2);
    rootElement.appendChild(Selection.shadowBorder('w-resize', -oPpadding, null, 0, 0, oPpadding+iPpadding, null));
    rootElement.appendChild(Selection.shadowBorder('e-resize', null, -oPpadding, 0, 0, oPpadding+iPpadding, null));
    rootElement.appendChild(Selection.shadowBorder('n-resize', 0, 0, -oPpadding, null, null, oPpadding+iPpadding));
    rootElement.appendChild(Selection.shadowBorder('s-resize', 0, 0, null, -oPpadding, null, oPpadding+iPpadding));
    rootElement.appendChild(Selection.shadowBorder('nw-resize', -oPpadding, null, -oPpadding, null, oPpadding+corner*2, oPpadding+corner*2));
    rootElement.appendChild(Selection.shadowBorder('ne-resize', null, -oPpadding, -oPpadding, null, oPpadding+corner*2, oPpadding+corner*2));
    rootElement.appendChild(Selection.shadowBorder('sw-resize', -oPpadding, null, null, -oPpadding, oPpadding+corner*2, oPpadding+corner*2));
    rootElement.appendChild(Selection.shadowBorder('se-resize', null, -oPpadding, null, -oPpadding, oPpadding+corner*2, oPpadding+corner*2));
    return new Selection(rootElement);
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

  private subscription: Subscription;
  private selection: Selection = null;

  constructor(private selectionService: SelectionService,
              elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnInit() {
    this.subscription = this.selectionService.selected.subscribe(t => this.selectTarget(t));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private selectTarget(target: HTMLElement) {
    this.clearSelection();
    if (target) {
      this.selection = Selection.fromElement(target);
      this.selection.attach(this.getNativeElement());
    }
  }

  private clearSelection() {
    if (this.selection) {
      this.selection.remove();
      this.selection = null;
    }
  }

}
