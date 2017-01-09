import { Component } from '@angular/core';

@Component({
  selector: 'app-elements-container',
  template: `<div (drop)="onDrop($event)" (dragover)="allowDrop($event)"></div>`,
  styles: [ `div {position: absolute; width: 100%; height: 100%}` ]
})
export class ElementsContainerComponent {
  
  onDrop(event) {
    let dataTransfer = event.dataTransfer.getData('data');
    console.log('onDrop', dataTransfer)
    event.preventDefault();
  }

  allowDrop(event) {
    console.log('allowDrop', event)
    event.preventDefault();
  }

}
