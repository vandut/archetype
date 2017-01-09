import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CopyParentSizeDirective } from './copy-parent-size.directive';
import { SnappingGridComponent } from './snapping-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    CopyParentSizeDirective,
    SnappingGridComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
