import { Injectable } from '@angular/core';
import { Topic } from "./topic"

export class DragAndDropMessage {
  constructor(public event: MouseEvent, public template: string = undefined) {}
}

@Injectable()
export class DragAndDropService {

  public dragStartTopic = new Topic<DragAndDropMessage>();
  public dragStopTopic = new Topic<DragAndDropMessage>();

  public get dragStart() { return this.dragStartTopic; }
  public get dragStop() { return this.dragStopTopic; }

  public get dragPadding() { return 10; }

}
