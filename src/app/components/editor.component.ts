import { Component, ViewChild } from '@angular/core';
import { SnappingGridComponent } from './snapping-grid.component';
import { ElementCompositorComponent } from './element-compositor.component';
import { ElementSelectionComponent } from './element-selection.component';
import { PageCoordinates } from '../utils/PageCoordinates';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {

  @ViewChild(SnappingGridComponent)
  private snappingGrid: SnappingGridComponent;

  @ViewChild(ElementCompositorComponent)
  private elementCompositor: ElementCompositorComponent;

  @ViewChild(ElementSelectionComponent)
  private selectionLayer: ElementSelectionComponent;

  isPageCoordinatesInside(coordinates: PageCoordinates): boolean {
    return this.elementCompositor.isPageCoordinatesInsideComponent(coordinates);
  }

  addElement(template: string, coordinates: PageCoordinates) {
    let element = this.elementCompositor.addElement(template, coordinates);
    this.selectionLayer.selectTarget(element);
  }

  clearSelection() {
    this.selectionLayer.clearSelection();
  }

  onElementSelected(element: HTMLElement) {
    if (element) {
      this.selectionLayer.selectTarget(element);
    } else {
      this.selectionLayer.clearSelection();
    }
  }

}
