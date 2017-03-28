import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { PreviewCanvasService } from '../../../drag/preview-canvas.service';

@Component({
  selector: 'preview-layer',
  template: ``,
  styleUrls: [ './preview-layer.component.css' ]
})
export class PreviewLayerComponent implements OnInit, OnDestroy {

  constructor(private elementRef: ElementRef,
              private previewCanvasService: PreviewCanvasService) {}

  public ngOnInit(): void {
    this.previewCanvasService.registerCanvas(this.elementRef);
  }

  public ngOnDestroy(): void {
    this.previewCanvasService.clearCanvas();
  }

}
