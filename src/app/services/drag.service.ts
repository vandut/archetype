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

  beginDrag(source: any, data: any, cause?: Event) {
    if (!this.isDragActive()) {
      this.initiatingDragDetail = new DragDetail(source, data, cause);
      DragService.broadcastEvent(DragEventNames.DISPATCH_BEGIN, this.initiatingDragDetail);
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
