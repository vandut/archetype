import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './components/app.component';
import { CopyParentSizeDirective } from './directives/copy-parent-size.directive';
import { SnappingGridComponent } from './components/snapping-grid.component';
import { ElementsPalleteComponent } from './components/elements-pallete.component';
import { ElementCompositorComponent } from './components/element-compositor.component';
import { DragPreviewInjectComponent } from './components/drag-preview-inject.component';
import { SelectionLayerComponent } from './components/selection-layer.component';
import { EditorComponent } from './components/editor.component';

@NgModule({
  declarations: [
    AppComponent,
    CopyParentSizeDirective,
    SnappingGridComponent,
    ElementsPalleteComponent,
    ElementCompositorComponent,
    DragPreviewInjectComponent,
    SelectionLayerComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
