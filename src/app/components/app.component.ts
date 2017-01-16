import { Component } from '@angular/core';
import { DragAndDropService } from '../services/drag-and-drop.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    DragAndDropService
  ]
})
export class AppComponent {
}
