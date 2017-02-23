import { Component } from '@angular/core';
import { ElementRepositoryService } from '../services/element-repository.service';


@Component({
  selector: 'app-element-explorer',
  templateUrl: './element-explorer.component.html',
  styleUrls: ['./element-explorer.component.css']
})
export class ElementExplorerComponent {

  constructor(public elementRepositoryService: ElementRepositoryService) {}

}
