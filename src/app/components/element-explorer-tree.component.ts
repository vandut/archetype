import { Component, Input } from '@angular/core';
import { EditorElement } from '../services/element-repository.service';
import { ElementSelectionService } from '../services/element-selection.service';

@Component({
  selector: 'app-element-explorer-tree',
  templateUrl: './element-explorer-tree.component.html',
  styleUrls: ['./element-explorer-tree.component.css']
})
export class ElementExplorerTreeComponent {

  @Input()
  public tree: EditorElement[] = [];

  constructor(private elementSelectionService: ElementSelectionService) {}

  public onNodeClick(nodeId) {
    this.elementSelectionService.select(nodeId);
  }

  public diffuseClick(event: MouseEvent) {
    if (event.button === 0) {
      event.preventDefault();
    }
  }

}