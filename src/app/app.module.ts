import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './components/app.component';
import { CopyParentSizeDirective } from './directives/copy-parent-size.directive';
import { SnappingGridComponent } from './components/snapping-grid.component';
import { ElementPaletteComponent } from './components/element-palette.component';
import { ElementCompositorComponent } from './components/element-compositor.component';
import { ElementPreviewComponent } from './components/element-preview.component';
import { SelectionLayerComponent } from './components/selection-layer.component';
import { EditorComponent } from './components/editor.component';

@NgModule({
  declarations: [
    AppComponent,
    CopyParentSizeDirective,
    SnappingGridComponent,
    ElementPaletteComponent,
    ElementCompositorComponent,
    ElementPreviewComponent,
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
