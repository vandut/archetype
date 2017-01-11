import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { BaseDomManipulationComponent } from "./base-dom-manipulation.component"
import { SelectionService } from "../services/selection.service"
import { HTMLElementWrapper } from "../utils/HTMLElementWrapper"
import { Subscription } from 'rxjs/Rx';

class Selection {

    private constructor(private htmlElement: HTMLElementWrapper) {}

    static fromElement(element: HTMLElement) {
        return Selection.at(element.offsetLeft, element.offsetTop,
                            element.clientWidth, element.clientHeight);
    }

    static at(x: number, y: number, w: number, h: number) {
        let element = HTMLElementWrapper.fromDiv();
        element.setAbsolutePosition(x, y);
        element.setSize(w, h);
        element.style.outline = '2px dashed black';
        element.style.boxShadow = '0 0 0 2px white';
        return new Selection(element);
    }

    attach(element: HTMLElement) {
        this.htmlElement.appendAsChildOf(element);
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

  constructor(
    private selectionService: SelectionService,
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
