import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { DropZoneService } from './drop-zone.service';
import { PreviewDirective } from './preview.directive';
import { PreviewService } from './preview.service';
import { DragMoveService } from './drag-move.service';
import { DragResizeService } from './drag-resize.service';
import { DragMoveHandlerDirective } from './drag-move-handler.directive';

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
    PreviewDirective,
    DragMoveHandlerDirective
  ],
  declarations: [
    PreviewDirective,
    DragMoveHandlerDirective
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