import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-elements-container',
  template: `<div (dragenter)="onDragEnter($event)" (dragover)="onDragMove($event)" (dragleave)="onDragLeave($event)" (drop)="onDragFinished($event)">
               <div #test id="test">Test</div>
             </div>`,
  styles: [ `div {position: absolute; width: 100%; height: 100%}
             #test { display: none; width: 100px; height: 20px; border: 1px solid red; position: absolute; left: 10px; top: 10px; pointer-events: none; }` ]
})
export class ElementsContainerComponent {

  @ViewChild('test')
  testElementRef: ElementRef;

  onDragEnter(event: DragEvent) {
    this.testElementRef.nativeElement.style.display = 'block';
  }

  onDragMove(event: DragEvent) {
    const element = this.testElementRef.nativeElement;
    let x = event.offsetX - (element.width|element.clientWidth)/2;
    let y = event.offsetY - (element.height|element.clientHeight)/2;

    if (!event.altKey) {
      x = Math.round(x/10)*10;
      y = Math.round(y/10)*10;
    }

    element.style.left = x + 'px';
    element.style.top = y + 'px';
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    this.testElementRef.nativeElement.style.display = 'none';
  }
  
  onDragFinished(event: DragEvent) {
    let dataTransfer = event.dataTransfer.getData('data');
    event.preventDefault();
  }

}
