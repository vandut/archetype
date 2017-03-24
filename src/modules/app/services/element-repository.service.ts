import { Injectable } from '@angular/core';
import { HTMLElementFactory, HTMLElementChmod, HTMLElementTransformer } from '../../shared/HTMLElement';
import * as Rx from 'rxjs/Rx';
import { PartialObserver } from 'rxjs/Observer';

export class EditorElement {
  constructor(public id: string,
              public htmlDom: HTMLElement,
              public selected: boolean,
              public children?: EditorElement[]) {
  }
}

export class ElementRepositoryHelper {

  private static ROOT_PARENT_NAME = 'root';
  private static DATA_ATTR_PARENT_FOR = 'dragParentFor';
  private static DATA_ATTR_CHILD_OF = 'dragChildOf';

  public static registerIsParentFor(target: HTMLElement, name: string) {
    target.dataset[ElementRepositoryHelper.DATA_ATTR_PARENT_FOR] = name;
  }
  public static getIsParentFor(target: HTMLElement): string {
    return target.dataset[ElementRepositoryHelper.DATA_ATTR_PARENT_FOR];
  }

  public static registerIsChildOf(target: HTMLElement, parentName: string) {
    target.dataset[ElementRepositoryHelper.DATA_ATTR_CHILD_OF] = parentName;
  }
  public static getIsChildOf(target: HTMLElement): string {
    return target.dataset[ElementRepositoryHelper.DATA_ATTR_CHILD_OF];
  }

  public static registerIsParentForRoot(target: HTMLElement) {
    ElementRepositoryHelper.registerIsParentFor(target, ElementRepositoryHelper.ROOT_PARENT_NAME);
  }
  public static registerIsChildOfRoot(target: HTMLElement) {
    ElementRepositoryHelper.registerIsChildOf(target, ElementRepositoryHelper.ROOT_PARENT_NAME);
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
  public getEditorElement(id: string): EditorElement {
    let [a, i] = this.findArrayById(this.elements, id);
    if (a) {
      return a[i];
    }
    return null;
  }

  private findArrayById(array: EditorElement[], id: string): [EditorElement[], number] {
    if (!array) {
      return [null, -1];
    }
    for (let idx = 0; idx < array.length; idx++) {
      if (array[idx].id === id) {
        return [array, idx];
      } else if(array[idx].children) {
        let [a, i] = this.findArrayById(array[idx].children, id);
        if (a) {
          return [a, i];
        }
      }
    }
    return [null, -1];
  }

  public moveItemBefore(itemId: string, beforeId: string) {
    if (itemId === beforeId) {
      return;
    }

    const [itemArray, itemIdx] = this.findArrayById(this.elements, itemId);
    const item = itemArray[itemIdx];

    const [beforeArray, beforeIdx] = this.findArrayById(this.elements, beforeId);
    const before = beforeArray[beforeIdx];

    console.log(`move item ${itemId} before ${beforeId}`);

    setTimeout(() => {
      if (itemIdx > beforeIdx) {
        itemArray.splice(itemIdx, 1);
        beforeArray.splice(beforeIdx, 0, item);
      } else {
        beforeArray.splice(beforeIdx, 0, item);
        itemArray.splice(itemIdx, 1);
      }

      item.htmlDom.parentNode.insertBefore(item.htmlDom, before.htmlDom.nextSibling);
    }, 0);

    // TODO: set parent data attr
  }

  public moveItemAfter(itemId: string, afterId: string) {
    if (itemId === afterId) {
      return;
    }

    const [itemArray, itemIdx] = this.findArrayById(this.elements, itemId);
    const item = itemArray[itemIdx];

    const [afterArray, afterIdx] = this.findArrayById(this.elements, afterId);
    const after = afterArray[afterIdx];

    console.log(`move item ${itemId} after ${afterId}`);

    setTimeout(() => {
      if (itemIdx > afterIdx) {
        itemArray.splice(itemIdx, 1);
        afterArray.splice(afterIdx + 1, 0, item);
      } else {
        afterArray.splice(afterIdx + 1, 0, item);
        itemArray.splice(itemIdx, 1);
      }

      after.htmlDom.parentNode.insertBefore(item.htmlDom, after.htmlDom);
    }, 0);

    // TODO: set parent data attr
  }

  public moveItemInside(itemId: string, insideId: string) {
    if (itemId === insideId) {
      return;
    }

    const [itemArray, itemIdx] = this.findArrayById(this.elements, itemId);
    const item = itemArray[itemIdx];

    const [insideArray, insideIdx] = this.findArrayById(this.elements, insideId);
    const inside = insideArray[insideIdx];

    console.log(`move item ${itemId} inside ${insideId}`);

    const [a, i] = this.findArrayById(item.children, insideId);
    if (a) {
      console.debug(`item ${itemId} is parent of ${insideId}`);
      return;
    }

    setTimeout(() => {
      if (!inside.children) {
        inside.children = [];
      }
      inside.children.splice(0, 0, item);
      itemArray.splice(itemIdx, 1);

      HTMLElementTransformer.of(item.htmlDom).positionType = 'static';
      HTMLElementTransformer.of(item.htmlDom).positionType = 'absolute';
      inside.htmlDom.appendChild(item.htmlDom);
    }, 0);

    // TODO: set parent data attr
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
    ElementRepositoryHelper.registerIsChildOfRoot(editorElement.htmlDom);
  }

  public subscribeToNewElementAdded(observer: PartialObserver<EditorElement>): Rx.Subscription {
    return this.newElementAddedSubject.subscribe(observer);
  }

}
