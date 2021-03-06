import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditorElement } from '../../services/element-repository.service';
import { ElementSelectionService } from '../../services/element-selection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: './editor-selection-layer',
  templateUrl: './selection-layer.component.html'
})
export class SelectionLayerComponent implements OnInit, OnDestroy {

  public selectedElement: EditorElement = null;
  private subscription: Subscription = null;

  constructor(private elementSelectionService: ElementSelectionService) {}

  public ngOnInit() {
    this.subscription = this.elementSelectionService.subscribeToChanges({
      next: element => this.selectedElement = element
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
