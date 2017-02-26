import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { PreviewService } from '../services/preview.service';

@Component({
  selector: 'app-element-preview',
  template: ``
})
export class ElementPreviewComponent extends BaseDomManipulationComponent implements OnInit, OnDestroy {

  constructor(elementRef: ElementRef, private previewService: PreviewService) {
    super(elementRef);
  }

  public ngOnInit(): void {
    this.previewService.registerCanvas(this);
  }

  public ngOnDestroy(): void {
    this.previewService.clearCanvas();
  }

}
