import { ElementRef, Injectable } from '@angular/core';

@Injectable()
export class PreviewCanvasService {

  private canvas: ElementRef = null;

  public registerCanvas(canvas: ElementRef) {
    this.canvas = canvas;
  }

  public getCanvas(): ElementRef {
    return this.canvas;
  }

  public clearCanvas() {
    this.canvas = null;
  }

}
