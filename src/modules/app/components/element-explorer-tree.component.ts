import { Component, Input, HostListener, ViewChildren, ElementRef } from '@angular/core';
import { EditorElement } from '../services/element-repository.service';
import { ElementSelectionService } from '../services/element-selection.service';
import { PageCoordinatesHelper } from '../../shared/PageCoordinatesHelper';

// TODO: extract as a component to separate module
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
  private activedropZone: ElementRef = null;

  constructor(private elementSelectionService: ElementSelectionService) {}

  public onNodeClick(nodeId) {
    this.elementSelectionService.select(nodeId);
  }

  @HostListener('panmove', ['$event'])
  public onPanMove(event: HammerInput) {
    const result = this.findDropZone(event.center);
    this.highlightDropZone(result);
  }

  @HostListener('panend', ['$event'])
  public onPanEnd(event: HammerInput) {
    const result = this.findDropZone(event.center);
    if (result) {
      console.log(result);
    }
    this.highlightDropZone(null);
  }

  @HostListener('pancancel', ['$event'])
  public onPanCancel(event: HammerInput) {
    this.highlightDropZone(null);
  }

  private findDropZone(point: HammerPoint): ElementRef {
    const coordinates = PageCoordinatesHelper.fromHammerPoint(point);
    return this.dropZones.find(dropZone => PageCoordinatesHelper.isInsideElement(dropZone, coordinates));
  }

  private highlightDropZone(ref: ElementRef) {
    if (!ref && this.activedropZone) {
      this.activedropZone.nativeElement.dataset['show'] = 'false';
    }
    if (ref && this.activedropZone && ref !== this.activedropZone) {
      this.activedropZone.nativeElement.dataset['show'] = 'false';
    }
    if (ref) {
      this.activedropZone = ref;
      this.activedropZone.nativeElement.dataset['show'] = 'true';
    }
  }

}
