import { Component, Input, HostListener, ViewChildren, ElementRef } from '@angular/core';
import { EditorElement } from '../services/element-repository.service';
import { ElementSelectionService } from '../services/element-selection.service';
import { PageCoordinatesHelper } from '../../shared/PageCoordinatesHelper';

@Component({
  selector: 'app-element-explorer-tree',
  templateUrl: './element-explorer-tree.component.html',
  styleUrls: ['./element-explorer-tree.component.css']
})
export class ElementExplorerTreeComponent {

  @Input()
  public tree: EditorElement[] = [];

  @ViewChildren('dropZone')
  private dropZones: ElementRef[];
  @ViewChildren('tree')
  private nestedTrees: ElementExplorerTreeComponent[];

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
