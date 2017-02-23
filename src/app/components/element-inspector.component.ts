import { Component, OnInit, OnDestroy } from '@angular/core';
import { HTMLElementTransformer } from '../utils/HTMLElement';
import { ElementSelectionService } from '../services/element-selection.service';
import { Subscription } from 'rxjs';

interface PropertyBinding {
  id: string;
  name: string;
}

@Component({
  selector: 'app-element-inspector',
  templateUrl: './element-inspector.component.html',
  styleUrls: ['./element-inspector.component.css']
})
export class ElementInspectorComponent implements OnInit, OnDestroy {

  public selectedElement: HTMLElementTransformer = null;

  public enabledPositionTypes: PropertyBinding[] = [
    { id: 'absolute', name: 'Absolute' },
    { id: 'static', name: 'Static' },
  ];
  public enabledProperties: PropertyBinding[] = [
    { id: 'positionX', name: 'Position left' },
    { id: 'positionY', name: 'Position top' },
    { id: 'totalWidth', name: 'Total width' },
    { id: 'totalHeight', name: 'Total height' },
  ];

  private subscription: Subscription = null;

  constructor(private elementSelectionService: ElementSelectionService) {}

  public ngOnInit() {
    this.subscription = this.elementSelectionService.subscribeToChanges({
      next: element => this.selectedElement = element ? HTMLElementTransformer.of(element.htmlDom) : null
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
