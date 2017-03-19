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
      console.log(result);
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

}
