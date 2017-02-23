import { BrowserModule } from '@angular/platform-browser';
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
import { DragService } from './services/drag.service';
import { ElementInspectorComponent } from './components/element-inspector.component';
import { ElementExplorerComponent } from './components/element-explorer.component';
import { ElementExplorerTreeComponent } from './components/element-explorer-tree.component';
import { ElementRepositoryService } from './services/element-repository.service';
import { ElementSelectionService } from './services/element-selection.service';

@NgModule({
  declarations: [
    AppComponent,
    CopyParentSizeDirective,
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
    DragService,
    ElementRepositoryService,
    ElementSelectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
