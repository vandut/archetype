import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app.component';
import { CopyParentSizeDirective } from './directives/copy-parent-size.directive';
import { SnappingGridComponent } from './components/snapping-grid.component';
import { ElementsPalleteComponent } from './components/elements-pallete.component';
import { ElementsContainerComponent } from './components/elements-container.component';
import { DragPreviewInjectComponent } from './components/drag-preview-inject.component';

@NgModule({
  declarations: [
    AppComponent,
    CopyParentSizeDirective,
    SnappingGridComponent,
    ElementsPalleteComponent,
    ElementsContainerComponent,
    DragPreviewInjectComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
