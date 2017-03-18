import { Injectable } from '@angular/core';

export class DragEventNames {
  static readonly DISPATCH_BEGIN = 'dragbegin';
  static readonly DISPATCH_MOVE = 'dragmove';
  static readonly DISPATCH_END = 'dragend';

  static readonly RECEIVE_BEGIN = 'document:' + DragEventNames.DISPATCH_BEGIN;
  static readonly RECEIVE_MOVE = 'document:' + DragEventNames.DISPATCH_MOVE;
  static readonly RECEIVE_END = 'document:' + DragEventNames.DISPATCH_END;
}

export class DragDetail<T, E extends Event> {
  constructor(public source: any,
              public data: T,
              public cause?: E) {}
}

@Injectable()
export class LegacyDragService {

  private initiatingDragDetail: DragDetail<any, Event> = null;

  private static broadcastEvent(name: string, detail: DragDetail<any, Event>) {
    document.dispatchEvent(new CustomEvent(name, {detail: detail}));
  }

  constructor() {
    this.registerListeners();
  }

  private isDragActive(): boolean {
    return !!this.initiatingDragDetail;
  }

  beginDrag(source: any, data: any, cause?: Event) {
    if (!this.isDragActive()) {
      this.initiatingDragDetail = new DragDetail(source, data, cause);
      LegacyDragService.broadcastEvent(DragEventNames.DISPATCH_BEGIN, this.initiatingDragDetail);
    } else {
      console.warn('Cannot start new drag, existing one is active.');
    }
  }

  private endDrag(cause?: Event) {
    const dragDetail = this.copyInitiatingDragDetail(cause);
    LegacyDragService.broadcastEvent(DragEventNames.DISPATCH_END, dragDetail);
    this.initiatingDragDetail = null;
  }

  private registerListeners() {
    document.addEventListener('mousemove', event => {
      if (this.isDragActive()) {
        LegacyDragService.broadcastEvent(DragEventNames.DISPATCH_MOVE, this.copyInitiatingDragDetail(event));
      }
    });
    document.addEventListener('mouseup', event => {
      if (this.isDragActive()) {
        this.endDrag(event);
      }
    });
  }

  private copyInitiatingDragDetail(cause?: Event) {
    return new DragDetail(
      this.initiatingDragDetail.source,
      this.initiatingDragDetail.data,
      cause
    );
  }

}
