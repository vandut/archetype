import { Injectable } from '@angular/core';

export class DragDetail<T, E extends Event> {
  constructor(public source: any,
              public data: T,
              public cause?: E) {}
}

@Injectable()
export class DragService {

  private static BEGIN_EVENT_NAME = 'dragbegin';
  private static MOVE_EVENT_NAME = 'dragmove';
  private static END_EVENT_NAME = 'dragend';

  public static BEGIN_EVENT = 'document:' + DragService.BEGIN_EVENT_NAME;
  public static MOVE_EVENT = 'document:' + DragService.MOVE_EVENT_NAME;
  public static END_EVENT = 'document:' + DragService.END_EVENT_NAME;

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
        DragService.broadcastEvent(DragService.MOVE_EVENT_NAME, this.copyInitiatingDragDetail(event))
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
      DragService.broadcastEvent(DragService.BEGIN_EVENT_NAME, detail);
    } else {
      console.warn("Cannot start new drag, existing one is active.");
    }
  }

  endDrag(cause?: Event) {
    let dragDetail = this.copyInitiatingDragDetail(cause);
    DragService.broadcastEvent(DragService.END_EVENT_NAME, dragDetail);
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
