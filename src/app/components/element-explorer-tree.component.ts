import { Component, Input } from '@angular/core';

export class TreeNode {
  constructor(public id: String,
              public name: String,
              public children?: TreeNode[]) {
  }
}

@Component({
  selector: 'app-element-explorer-tree',
  templateUrl: './element-explorer-tree.component.html',
  styleUrls: ['./element-explorer-tree.component.css']
})
export class ElementExplorerTreeComponent {

  @Input()
  public nodes: TreeNode[] = [];

}
