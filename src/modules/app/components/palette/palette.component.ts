import { Component } from '@angular/core';

@Component({
  selector: 'palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.css']
})
export class PaletteComponent {

  public static DEFAULT_DIV_TEMPLATE = '<div style="width: 100px; height: 100px; background: red;">A</div>';

  public items = [
    {
      name: 'Stub element',
      template: PaletteComponent.DEFAULT_DIV_TEMPLATE
    }
  ];

}
