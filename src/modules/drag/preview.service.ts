import { Injectable, ElementRef } from '@angular/core';
import { PageCoordinates } from '../shared/PageCoordinates';
import { HTMLElementTransformer, HTMLElementChmod } from '../shared/HTMLElement';
import { DomHelper } from '../shared/DomHelper';
import { PageCoordinatesHelper } from '../shared/PageCoordinatesHelper';

@Injectable()
export class PreviewService {
  private static PADDING = 10;

  private canvas: ElementRef;

  public preview: PreviewHost = null;

  public registerCanvas(canvas: ElementRef) {
    this.canvas = canvas;
  }

  public clearCanvas() {
    this.canvas = null;
  }

  public startPreview(target: HTMLElement, coordinates: PageCoordinates) {
    if (!this.preview) {
      coordinates = PreviewService.addPreviewPadding(coordinates);
      const [x, y] = PageCoordinatesHelper.toParentElementCoordinates(this.canvas, coordinates);
      this.preview = new PreviewHost(target);
      this.preview.attach(DomHelper.getParentElement(this.canvas));
      this.preview.moveTo(x, y);
    }
  }

  public movePreview(coordinates: PageCoordinates) {
    if (this.preview) {
      if (PageCoordinatesHelper.isInsideParentElement(this.canvas, coordinates)) {
        if (!this.preview.isVisible()) {
          this.preview.show();
        }
        this.movePreviewTo(coordinates);
      } else {
        if (this.preview.isVisible()) {
          this.preview.hide();
        }
      }
    }
  }

  private movePreviewTo(coordinates: PageCoordinates) {
    coordinates = PreviewService.addPreviewPadding(coordinates);
    const [x, y] = PageCoordinatesHelper.toParentElementCoordinates(this.canvas, coordinates);
    this.preview.moveTo(x, y);
  }

  public endPreview() {
    if (this.preview) {
      this.preview.remove();
      this.preview = null;
    }
  }

  public static addPreviewPadding(coordinates: PageCoordinates): PageCoordinates {
    return {
      pageX: coordinates.pageX - PreviewService.PADDING,
      pageY: coordinates.pageY - PreviewService.PADDING
    };
  }

}

class PreviewHost {

  private host: HTMLElement;

  constructor(src: HTMLElement) {
    this.host = HTMLElementChmod.of(<HTMLElement> src.cloneNode(true))
      .positionOnTop()
      .setOpacity(0.25)
      .addClass('cursor_grabbing')
      .done();
  }

  attach(parent: Node) {
    parent.appendChild(this.host);
  }

  remove() {
    this.host.remove();
  }

  isVisible(): boolean {
    return !this.host.style.visibility;
  }

  show() {
    this.host.style.visibility = null;
  }

  hide() {
    this.host.style.visibility = 'hidden';
  }

  moveTo(offsetX: number, offsetY: number) {
    const transformer = HTMLElementTransformer.of(this.host);
    transformer.positionX = offsetX;
    transformer.positionY = offsetY;
  }

}
