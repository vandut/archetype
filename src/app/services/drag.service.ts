import { Injectable, HostListener } from '@angular/core';
import { makePropDecorator } from '@angular/core/src/util/decorators';

class DragEventNames {
  static DISPATCH_BEGIN = 'dragbegin';
  static DISPATCH_MOVE = 'dragmove';
  static DISPATCH_END = 'dragend';

  static RECEIVE_BEGIN = 'document:' + DragEventNames.DISPATCH_BEGIN;
  static RECEIVE_MOVE = 'document:' + DragEventNames.DISPATCH_MOVE;
  static RECEIVE_END = 'document:' + DragEventNames.DISPATCH_END;
}

export class DragDetail<T, E extends Event> {
  constructor(public source: any,
              public data: T,
              public cause?: E) {}
}

export let DragBeginListener = makePropDecorator('DragBeginListener', [{'eventName': DragEventNames.RECEIVE_BEGIN}, {'args': ['$event.detail']}], HostListener);
export let DragMoveListener = makePropDecorator('DragMoveListener', [{'eventName': DragEventNames.RECEIVE_MOVE}, {'args': ['$event.detail']}], HostListener);
export let DragEndListener = makePropDecorator('DragEndListener', [{'eventName': DragEventNames.RECEIVE_END}, {'args': ['$event.detail']}], HostListener);

@Injectable()
export class DragService {


  private initiatingDragDetail: DragDetail<any, Event> = null;

  constructor() {
    this.registerListeners();
  }

  isDragActive(): boolean {
    return !!this.initiatingDragDetail;
  }

  private registerListeners() {
    document.addEventListener('mousemove', event => {
      if (this.isDragActive()) {
        DragService.broadcastEvent(DragEventNames.DISPATCH_MOVE, this.copyInitiatingDragDetail(event))
      }
    });
    document.addEventListener('mouseup', event => {
      if (this.isDragActive()) {
        this.endDrag(event);
      }
    });
  }

  beginDrag(detail: DragDetail<any, Event>) {
    if (!this.isDragActive()) {
      this.initiatingDragDetail = detail;
      DragService.broadcastEvent(DragEventNames.DISPATCH_BEGIN, detail);
    } else {
      console.warn("Cannot start new drag, existing one is active.");
    }
  }

  endDrag(cause?: Event) {
    let dragDetail = this.copyInitiatingDragDetail(cause);
    DragService.broadcastEvent(DragEventNames.DISPATCH_END, dragDetail);
    this.initiatingDragDetail = null;
  }

  private copyInitiatingDragDetail(cause?: Event) {
    return new DragDetail(
      this.initiatingDragDetail.source,
      this.initiatingDragDetail.data,
      cause
    );
  }

  private static broadcastEvent(name: string, detail: DragDetail<any, Event>) {
    document.dispatchEvent(new CustomEvent(name, {detail: detail}));
  }

}
