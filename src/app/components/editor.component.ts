import { Component, ViewChild } from '@angular/core';
import { SnappingGridComponent } from './snapping-grid.component';
import { ElementCompositorComponent } from './element-compositor.component';
import { SelectionLayerComponent } from './selection-layer.component';
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

  @ViewChild(SelectionLayerComponent)
  private selectionLayer: SelectionLayerComponent;

  isPageCoordinatesInside(coordinates: PageCoordinates): boolean {
    return this.elementCompositor.isPageCoordinatesInsideComponent(coordinates);
  }

  addElement(template: string, coordinates: PageCoordinates) {
    this.elementCompositor.addElement(template, coordinates);
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
