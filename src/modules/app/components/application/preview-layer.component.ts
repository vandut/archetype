import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { PreviewService } from '../../../drag/preview.service';

@Component({
  selector: 'preview-layer',
  template: ``
})
export class PreviewLayerComponent implements OnInit, OnDestroy {

  constructor(private elementRef: ElementRef,
              private previewService: PreviewService) {}

  public ngOnInit(): void {
    this.previewService.registerCanvas(this.elementRef);
  }

  public ngOnDestroy(): void {
    this.previewService.clearCanvas();
  }

}
