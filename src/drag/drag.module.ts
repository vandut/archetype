import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { DropZoneService } from './drop-zone.service';
import { PreviewDirective } from './preview.directive';
import { PreviewService } from './preview.service';
import { DragMoveService } from './drag-move.service';
import { DragResizeService } from './drag-resize.service';

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
    'pan': {direction: Hammer.DIRECTION_ALL}
  }
}

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    PreviewDirective
  ],
  declarations: [
    PreviewDirective
  ],
  providers: [
    DragMoveService,
    DragResizeService,
    DropZoneService,
    PreviewService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ]
})
export class DragModule { }
