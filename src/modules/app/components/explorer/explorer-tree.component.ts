import { Component, ElementRef, Input, ViewChildren } from '@angular/core';
import { EditorElement } from '../../services/element-repository.service';
import { ElementSelectionService } from '../../services/element-selection.service';
import { Position2D, Position2DHelper } from '../../../shared/Position2D';

@Component({
  selector: 'explorer-tree',
  templateUrl: './explorer-tree.component.html',
  styleUrls: ['./explorer-tree.component.css']
})
export class ExplorerTreeComponent {

  @Input()
  public tree: EditorElement[] = [];

  @ViewChildren('dropZone')
  private dropZones: ElementRef[];
  @ViewChildren('tree')
  private nestedTrees: ExplorerTreeComponent[];

  constructor(public elementRef: ElementRef,
              private elementSelectionService: ElementSelectionService) {}

  public onNodeClick(nodeId) {
    this.elementSelectionService.select(nodeId);
  }

  public findDropZone(position: Position2D): ElementRef {
    const zone = this.dropZones.find(dropZone => Position2DHelper.isInsideElement(dropZone, position));
    if (zone) {
      return zone;
    }
    const nestedTree = this.nestedTrees.find(tree => Position2DHelper.isInsideElement(tree.elementRef, position));
    if (nestedTree) {
      return nestedTree.findDropZone(position);
    }
  }

}
