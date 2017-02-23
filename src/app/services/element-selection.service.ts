import { Injectable } from '@angular/core';
import { EditorElement, ElementRepositoryService } from './element-repository.service';
import * as Rx from 'rxjs/Rx';
import { PartialObserver } from 'rxjs/Observer';

@Injectable()
export class ElementSelectionService {

  private selectedElement: EditorElement = null;
  private subject: Rx.Subject<EditorElement> = new Rx.Subject();

  constructor(private elementRepositoryService: ElementRepositoryService) {}

  public clearSelection() {
    this.selectedElement = null;
    this.subject.next(null);
  }

  public select(editorElementId: string) {
    this.selectedElement = this.elementRepositoryService.getEditorElement(editorElementId);
    this.subject.next(this.selectedElement);
  }

  public subscribeToChanges(observer: PartialObserver<EditorElement>): Rx.Subscription {
    return this.subject.subscribe(observer);
  }

}
