import { Component } from '@angular/core';
import { TreeNode } from './element-explorer-tree.component';


@Component({
  selector: 'app-element-explorer',
  templateUrl: './element-explorer.component.html',
  styleUrls: ['./element-explorer.component.css']
})
export class ElementExplorerComponent {

  public nodes: TreeNode[] = [
    {id: 'id1', name: 'Element one', children: [
      {id: 'id2', name: 'Child one'},
      {id: 'id3', name: 'Child two'},
    ]},
    {id: 'id4', name: 'Element two verbose description', children: [
      {id: 'id5', name: 'Child another'},
    ]},
  ];

}
