import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { DropZoneService } from './drop-zone.service';
import { PreviewDirective } from './preview.directive';
import { PreviewCanvasService } from './preview-canvas.service';
import { DragService } from './drag.service';
import { DragMoveHandlerDirective } from './drag-move-handler.directive';
import { DraggableItemService } from './draggable-item.service';

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
    DragService,
    DropZoneService,
    PreviewCanvasService,
    DraggableItemService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ]
})
export class DragModule { }
