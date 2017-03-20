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

  public moveItemBefore(itemId: string, beforeId: string) {
    if (itemId === beforeId) {
      return;
    }

    const item = this.getEditorElement(itemId);
    const before = this.getEditorElement(beforeId);

    const itemIdx = this.elements.indexOf(item);
    const beforeIdx = this.elements.indexOf(before);

    console.log(`move item ${itemIdx} before ${beforeIdx}`);

    if (itemIdx > beforeIdx) {
      this.elements.splice(itemIdx, 1);
      this.elements.splice(beforeIdx, 0, item);
    } else {
      this.elements.splice(beforeIdx, 0, item);
      this.elements.splice(itemIdx, 1);
    }

    item.htmlDom.parentNode.insertBefore(item.htmlDom, before.htmlDom.nextSibling);
  }

  public moveItemAfter(itemId: string, afterId: string) {
    if (itemId === afterId) {
      return;
    }

    const item = this.getEditorElement(itemId);
    const after = this.getEditorElement(afterId);

    const itemIdx = this.elements.indexOf(item);
    const afterIdx = this.elements.indexOf(after);

    console.log(`move item ${itemIdx} after ${afterIdx}`);

    if (itemIdx > afterIdx) {
      this.elements.splice(itemIdx, 1);
      this.elements.splice(afterIdx + 1, 0, item);
    } else {
      this.elements.splice(afterIdx + 1, 0, item);
      this.elements.splice(itemIdx, 1);
    }

    after.htmlDom.parentNode.insertBefore(item.htmlDom, after.htmlDom);
  }

  public moveItemInside(itemId: string, insideId: string) {
    if (itemId === insideId) {
      return;
    }

    // TODO: make sure that insideId in not in fact inside itemId (that would create cycle and detach whole subtree)

    console.log(`move item ${itemId} inside ${insideId}`);

    // TODO: perform move
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
    this.elements.splice(0, 0, editorElement);
    this.newElementAddedSubject.next(editorElement);
  }

  public subscribeToNewElementAdded(observer: PartialObserver<EditorElement>): Rx.Subscription {
    return this.newElementAddedSubject.subscribe(observer);
  }

}
