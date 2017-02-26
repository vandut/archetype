import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { BaseDomManipulationComponent } from './base-dom-manipulation.component';
import { HTMLElementFactory } from '../utils/HTMLElement';
import { DragDetail, DragEventNames } from '../services/legacy-drag.service';
import { ElementPaletteComponent } from './element-palette.component';
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

  @HostListener(DragEventNames.RECEIVE_BEGIN, ['$event.detail'])
  public onDragBegin(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      const target = HTMLElementFactory.fromTemplate(detail.data);
      this.previewService.startPreview(target, detail.cause);
    }
  }

  @HostListener(DragEventNames.RECEIVE_MOVE, ['$event.detail'])
  public onDragMove(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      this.previewService.movePreview(detail.cause);
    }
  }

  @HostListener(DragEventNames.RECEIVE_END, ['$event.detail'])
  public onDragEnd(detail: DragDetail<string, MouseEvent>) {
    if (detail.source instanceof ElementPaletteComponent) {
      this.previewService.endPreview();
    }
  }

}
