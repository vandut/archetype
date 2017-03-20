import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppComponent } from './components/application/app.component';
import { CopyParentSizeDirective } from './components/editor/copy-parent-size.directive';
import { BackgroundLayerComponent } from './components/editor/background-layer.component';
import { PaletteComponent } from './components/palette/palette.component';
import { CompositorLayerComponent } from './components/editor/compositor-layer.component';
import { PreviewLayerComponent } from './components/application/preview-layer.component';
import { SelectionLayerComponent } from './components/editor/selection-layer.component';
import { EditorComponent } from './components/editor/editor.component';
import { SelectionComponent } from './components/editor/selection.component';
import { InspectorComponent } from './components/inspector/inspector.component';
import { ExplorerComponent } from './components/explorer/explorer.component';
import { ExplorerTreeComponent } from './components/explorer/explorer-tree.component';
import { ElementRepositoryService } from './services/element-repository.service';
import { ElementSelectionService } from './services/element-selection.service';
import { DragModule } from '../drag/drag.module';

@NgModule({
  declarations: [
    AppComponent,
    CopyParentSizeDirective,
    BackgroundLayerComponent,
    PaletteComponent,
    CompositorLayerComponent,
    PreviewLayerComponent,
    SelectionLayerComponent,
    EditorComponent,
    SelectionComponent,
    InspectorComponent,
    ExplorerComponent,
    ExplorerTreeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DragModule
  ],
  providers: [
    ElementRepositoryService,
    ElementSelectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
