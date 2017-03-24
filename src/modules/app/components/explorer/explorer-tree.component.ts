import { Component, Input, ViewChildren, ElementRef } from '@angular/core';
import { EditorElement } from '../../services/element-repository.service';
import { ElementSelectionService } from '../../services/element-selection.service';
import { PageCoordinatesHelper } from '../../../shared/PageCoordinatesHelper';

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

  public findDropZone(point: HammerPoint): ElementRef {
    const coordinates = PageCoordinatesHelper.fromHammerPoint(point);
    const zone = this.dropZones.find(dropZone => PageCoordinatesHelper.isInsideElement(dropZone, coordinates));
    if (zone) {
      return zone;
    }
    const nestedTree = this.nestedTrees.find(tree => PageCoordinatesHelper.isInsideElement(tree.elementRef, coordinates));
    if (nestedTree) {
      return nestedTree.findDropZone(point);
    }
  }

}
