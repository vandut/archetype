import { Component } from '@angular/core';

@Component({
  selector: 'app-elements-pallete',
  templateUrl: './elements-pallete.component.html',
  styleUrls: ['./elements-pallete.component.css']
})
export class ElementsPalleteComponent {

  onDragStart(event: any) {
    event.dataTransfer.setData('data', "cs");
    event.dataTransfer.dropEffect = 'copy';
    event.dataTransfer.effectAllowed = 'copy';
    var img = new Image(); 
    event.dataTransfer.setDragImage(img,0,0);
  }

}
