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

  private static at(x: number, y: number, w: number, h: number) {
    return new Selection(HTMLElementChmod.fromDiv()
      .setAbsolutePosition(x, y)
      .setSize(w, h)
      .customStyle(style => {
        style.outline = '2px dashed black';
        style.boxShadow = '0 0 0 2px white';
      })
      .done()
    );
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
