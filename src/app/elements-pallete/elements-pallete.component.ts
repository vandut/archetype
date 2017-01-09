import { Component } from '@angular/core';

@Component({
  selector: 'app-elements-pallete',
  templateUrl: './elements-pallete.component.html',
  styleUrls: ['./elements-pallete.component.css']
})
export class ElementsPalleteComponent {

  onDragStart(event) {
    console.log('onDragStart event', event)
    event.dataTransfer.setData('data', "cs");
  }

}
