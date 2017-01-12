import { Injectable } from '@angular/core';
import { Topic } from './topic';

@Injectable()
export class SelectionService {

  public selectedTopic = new Topic<HTMLElement>();

  public get selected() {
    return this.selectedTopic;
  }

}
