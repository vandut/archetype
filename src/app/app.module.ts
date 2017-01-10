import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './component/app.component';
import { CopyParentSizeDirective } from './copy-parent-size.directive';
import { SnappingGridComponent } from './snapping-grid.component';
import { ElementsPalleteComponent } from './elements-pallete/elements-pallete.component';
import { ElementsContainerComponent } from './elements-container.component';
import { DragPreviewInjectComponent } from './drag-preview-inject.component';

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
