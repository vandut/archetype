import { Component, AfterViewInit, ViewChild, ElementRef, Input, HostListener } from '@angular/core';

@Component({
  selector: 'editor-background-layer',
  template: `<canvas #canvas copyParentSize></canvas>`,
  styles: [`canvas { width: 100%; height: 100%; }`]
})
export class BackgroundLayerComponent implements AfterViewInit {

  private _spacing: number = 10;

  get spacing(): number {
    return this._spacing;
  }

  @Input()
  set spacing(value: number) {
    this._spacing = value;
    this.clearCanvas();
    this.drawGrid();
  }

  @ViewChild('canvas')
  canvasElementRef: ElementRef;

  ngAfterViewInit() {
    this.drawGrid();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.drawGrid();
  }

  private getCanvas(): HTMLCanvasElement {
    return this.canvasElementRef.nativeElement;
  }

  private getCanvasContext() {
    return this.getCanvas().getContext('2d');
  }

  clearCanvas() {
    const canvas = this.getCanvas();
    const context = this.getCanvasContext();
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  drawGrid() {
    const canvas = this.getCanvas();
    const context = this.getCanvasContext();

    context.fillStyle = 'rgba(200,200,200,1)';

    const columns = Math.ceil(canvas.width / this.spacing);
    const rows = Math.ceil(canvas.height / this.spacing);

    for (let x = 1; x < columns; x++) {
      for (let y = 1; y < rows; y++) {
        context.fillRect(x * this.spacing, y * this.spacing, 1, 1);
      }
    }
  }

}
