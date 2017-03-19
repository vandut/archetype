import { Injectable } from '@angular/core';
import { HTMLElementFactory, HTMLElementChmod } from '../../shared/HTMLElement';
import * as Rx from 'rxjs/Rx';
import { PartialObserver } from 'rxjs/Observer';

export class EditorElement {
  constructor(public id: string,
              public htmlDom: HTMLElement,
              public selected: boolean,
              public children?: EditorElement[]) {
  }
}

@Injectable()
export class ElementRepositoryService {

  public static ID_DATA_ATTR_NAME = 'archetypeManagedId';

  private static ID_PREFIX = 'id#';
  private nextElementId = 0;

  public elements: EditorElement[] = [];
  private newElementAddedSubject: Rx.Subject<EditorElement> = new Rx.Subject();

  private generateNextElementId(): string {
    return ElementRepositoryService.ID_PREFIX + this.nextElementId++;
  }

  // TODO: Promise?
  // TODO: this is flat search, make it deep
  public getEditorElement(id: string): EditorElement {
    for (let el of this.elements) {
      if (el.id == id) {
        return el;
      }
    }
    return null;
  }

  private generateEditorElement(template: string): EditorElement {
    let editorElement = {
      id: this.generateNextElementId(),
      htmlDom: HTMLElementFactory.fromTemplate(template),
      selected: false
    };
    editorElement.htmlDom.dataset[ElementRepositoryService.ID_DATA_ATTR_NAME] = editorElement.id;
    return editorElement;
  }

  private positionElement(editorElement: EditorElement, x: number, y: number) {
    HTMLElementChmod.of(editorElement.htmlDom)
      .applyTransformation(t => {
        t.positionType = 'absolute';
        t.positionX = x;
        t.positionY = y;
      });
  }

  public addEditorElement(template: string, x: number, y: number) {
    let editorElement = this.generateEditorElement(template);
    this.positionElement(editorElement, x, y);
    this.elements.push(editorElement);
    this.newElementAddedSubject.next(editorElement);
  }

  public subscribeToNewElementAdded(observer: PartialObserver<EditorElement>): Rx.Subscription {
    return this.newElementAddedSubject.subscribe(observer);
  }

}
