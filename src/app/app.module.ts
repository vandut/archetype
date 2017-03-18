import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppComponent } from './components/app.component';
import { CopyParentSizeDirective } from './directives/copy-parent-size.directive';
import { SnappingGridComponent } from './components/snapping-grid.component';
import { ElementPaletteComponent } from './components/element-palette.component';
import { ElementCompositorComponent } from './components/element-compositor.component';
import { ElementPreviewComponent } from './components/element-preview.component';
import { ElementSelectionComponent } from './components/element-selection.component';
import { EditorComponent } from './components/editor.component';
import { SelectionComponent } from './components/selection.component';
import { ElementInspectorComponent } from './components/element-inspector.component';
import { ElementExplorerComponent } from './components/element-explorer.component';
import { ElementExplorerTreeComponent } from './components/element-explorer-tree.component';
import { ElementRepositoryService } from './services/element-repository.service';
import { ElementSelectionService } from './services/element-selection.service';
import { PreviewService } from './services/preview.service';
import { DragPreviewDirective } from './directives/drag-preview.directive';
import { DropZoneService } from './services/drop-zone.service';
import { DragMoveService, DragResizeService } from './services/drag.service';

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
    'pan': {direction: Hammer.DIRECTION_ALL}
  }
}

@NgModule({
  declarations: [
    AppComponent,
    CopyParentSizeDirective,
    DragPreviewDirective,
    SnappingGridComponent,
    ElementPaletteComponent,
    ElementCompositorComponent,
    ElementPreviewComponent,
    ElementSelectionComponent,
    EditorComponent,
    SelectionComponent,
    ElementInspectorComponent,
    ElementExplorerComponent,
    ElementExplorerTreeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    PreviewService,
    DropZoneService,
    DragMoveService,
    DragResizeService,
    ElementRepositoryService,
    ElementSelectionService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
