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

  private getGridCanvas(): HTMLCanvasElement {
    return this.canvasElementRef.nativeElement;
  }

  drawGrid() {
    let canvas = this.getGridCanvas();
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = "rgba(200,200,200,1)";

    let spacing = 10;
    let columns = Math.ceil(canvas.width / spacing);
    let rows = Math.ceil(canvas.height / spacing);

    for (let x = 1; x < columns; x++) {
      for (let y = 1; y < rows; y++) {
        ctx.fillRect(x * spacing, y * spacing, 1, 1);
      }
    }
  }

}
