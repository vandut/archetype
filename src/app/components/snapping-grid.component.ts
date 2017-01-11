import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-snapping-grid',
  template: `<canvas #canvas appCopyParentSize></canvas>`,
  styles:  [ `canvas { width: 100%; height: 100%; }` ]
})
export class SnappingGridComponent implements AfterViewInit {

  @ViewChild('canvas')
  canvasElementRef: ElementRef;

  ngAfterViewInit() {
    this.drawGrid();
  }

  @HostListener('window:resize')
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
    let canvas = this.getCanvas();
    let context = this.getCanvasContext();
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  drawGrid() {
    let canvas = this.getCanvas();
    let context = this.getCanvasContext();

    context.fillStyle = "rgba(200,200,200,1)";

    let spacing = 10;
    let columns = Math.ceil(canvas.width / spacing);
    let rows = Math.ceil(canvas.height / spacing);

    for (let x = 1; x < columns; x++) {
      for (let y = 1; y < rows; y++) {
        context.fillRect(x * spacing, y * spacing, 1, 1);
      }
    }
  }

}
