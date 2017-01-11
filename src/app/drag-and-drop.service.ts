import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';

export class DragAndDropMessage {
  constructor(public event: MouseEvent, public template: string = undefined) {}
}

class Topic<T> {
  private subject = new Rx.Subject<T>();
  emit(value: T) {
    this.subject.next(value);
  }
  subscribe(next?: (value: T) => void): Rx.Subscription {
    return this.subject.subscribe(next);
  }
}

@Injectable()
export class DragAndDropService {

  public dragStartTopic = new Topic<DragAndDropMessage>();
  public dragStopTopic = new Topic<DragAndDropMessage>();
  public dragAttachTopic = new Topic<DragAndDropMessage>();

  public get dragStart() { return this.dragStartTopic; }
  public get dragStop() { return this.dragStopTopic; }
  public get dragAttach() { return this.dragAttachTopic; }

  public get dragPadding() { return 10; }

}
