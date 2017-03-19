import { Component, ViewChild, HostListener, ElementRef } from '@angular/core';
import { ElementRepositoryService } from '../services/element-repository.service';
import { ElementExplorerTreeComponent } from './element-explorer-tree.component';

@Component({
  selector: 'app-element-explorer',
  templateUrl: './element-explorer.component.html',
  styleUrls: ['./element-explorer.component.css']
})
export class ElementExplorerComponent {

  @ViewChild('tree')
  private tree: ElementExplorerTreeComponent;

  private activedropZone: ElementRef = null;

  constructor(public elementRepositoryService: ElementRepositoryService) {}

  @HostListener('panmove', ['$event'])
  public onPanMove(event: HammerInput) {
    const result = this.tree.findDropZone(event.center);
    this.highlightDropZone(result);
  }

  @HostListener('panend', ['$event'])
  public onPanEnd(event: HammerInput) {
    const result = this.tree.findDropZone(event.center);
    if (result) {
      this.moveItem(<HTMLElement> event.srcEvent.target, result.nativeElement);
    }
    this.highlightDropZone(null);
  }

  @HostListener('pancancel', ['$event'])
  public onPanCancel(event: HammerInput) {
    this.highlightDropZone(null);
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

  private moveItem(source: HTMLElement, dropZone: HTMLElement) {
    const sourceId = source.dataset['nodeId'];
    if (dropZone.dataset['before']) {
      this.elementRepositoryService.moveItemBefore(sourceId, dropZone.dataset['before']);
    } else if (dropZone.dataset['after']) {
      this.elementRepositoryService.moveItemAfter(sourceId, dropZone.dataset['after']);
    }
  }

}
