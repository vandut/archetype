import { Component, Input } from '@angular/core';
import { EditorElement } from '../services/element-repository.service';

@Component({
  selector: 'app-element-explorer-tree',
  templateUrl: './element-explorer-tree.component.html',
  styleUrls: ['./element-explorer-tree.component.css']
})
export class ElementExplorerTreeComponent {

  @Input()
  public tree: EditorElement[] = [];

}
