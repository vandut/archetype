import { Injectable } from '@angular/core';
import { HTMLElementFactory } from '../utils/HTMLElement';

export class EditorElement {
  constructor(public id: string,
              public htmlDom: HTMLElement,
              public children?: EditorElement[]) {
  }
}

@Injectable()
export class ElementRepositoryService {

  public static ID_DATA_ATTR_NAME = 'archetypeManagedId';

  private static ID_PREFIX = 'id#';
  private nextElementId = 0;

  public elements: EditorElement[] = [];

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

  public addEditorElement(template: string): EditorElement {
    let el = {
      id: this.generateNextElementId(),
      htmlDom: HTMLElementFactory.fromTemplate(template)
    };
    el.htmlDom.dataset[ElementRepositoryService.ID_DATA_ATTR_NAME] = el.id;
    this.elements.push(el);
    return el;
  }

}
