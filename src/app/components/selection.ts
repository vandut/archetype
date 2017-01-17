import { PageCoordinates } from '../utils/PageCoordinates';
import { HTMLElementChmod } from '../utils/HTMLElement';

export enum SelectionActionType {
  Move,
  Resize_N,
  Resize_S,
  Resize_W,
  Resize_E,
  Resize_NW,
  Resize_NE,
  Resize_SW,
  Resize_SE
}

export interface TargetSelection {
  getTarget(): HTMLElement;
  updateTarget();
}

export class SelectionMessage {
  constructor(public target: TargetSelection,
              public action: SelectionActionType,
              public coordinates: PageCoordinates) {}
}

export declare type ElementSelectionActionEventHandler = (target: TargetSelection, a: SelectionActionType, c: PageCoordinates) => boolean;

export class ElementSelection implements TargetSelection {

  private htmlElement: HTMLElement;

  constructor(private target: HTMLElement,
              private eventHandler: ElementSelectionActionEventHandler) {
    this.htmlElement = this.at(target.offsetLeft, target.offsetTop, target.clientWidth, target.clientHeight);
  }

  private static box(l: number, r: number, t: number, b: number, w: number, h: number) {
    return HTMLElementChmod.fromDiv()
      .customStyle(style => {
        style.position = 'absolute';
      })
      .custom(element => {
        element.left = l;
        element.right = r;
        element.top = t;
        element.bottom = b;
        element.width = w;
        element.height = h;
      });
  }

  private static borderAll(x: number, y: number, w: number, h: number, padding: number) {
    return ElementSelection.box(x, null, y, null, w, h)
      .pointerEvents(false)
      .customStyle(style => {
        style.outline = `${padding}px dashed rgba(0, 0, 0, 1.0)`;
        style.boxShadow = `0 0 0 ${padding}px rgba(255, 255, 255, 1.0)`;
      })
      .done();
  }

  private static boxSegment(handler: (e: MouseEvent) => boolean, cursor: string, l: number, r: number, t: number, b: number, w: number, h: number): HTMLElementChmod {
    return ElementSelection.box(l, r, t, b, w, h)
      .pointerEvents(true)
      .customStyle(style => {
        style.cursor = cursor;
      })
      .eventListener('mousedown', handler);
  }

  private at(x: number, y: number, w: number, h: number) {
    let oPpadding = 3;
    let iPpadding = 3;
    let corner = 2;
    let selectionBackground = 'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1) 10px, rgba(255, 255, 255, 0.1) 10px, rgba(255, 255, 255, 0.1) 20px)';
    let rootElement = ElementSelection.borderAll(x, y, w, h, 2);
    rootElement.appendChild(ElementSelection.boxSegment(this.handler(SelectionActionType.Move), 'move', 0, 0, 0, 0, null, null).customStyle(style => style.background = selectionBackground).done());
    rootElement.appendChild(ElementSelection.boxSegment(this.handler(SelectionActionType.Resize_W), 'w-resize', -oPpadding, null, 0, 0, oPpadding+iPpadding, null).done());
    rootElement.appendChild(ElementSelection.boxSegment(this.handler(SelectionActionType.Resize_E), 'e-resize', null, -oPpadding, 0, 0, oPpadding+iPpadding, null).done());
    rootElement.appendChild(ElementSelection.boxSegment(this.handler(SelectionActionType.Resize_N), 'n-resize', 0, 0, -oPpadding, null, null, oPpadding+iPpadding).done());
    rootElement.appendChild(ElementSelection.boxSegment(this.handler(SelectionActionType.Resize_S), 's-resize', 0, 0, null, -oPpadding, null, oPpadding+iPpadding).done());
    rootElement.appendChild(ElementSelection.boxSegment(this.handler(SelectionActionType.Resize_NW), 'nw-resize', -oPpadding, null, -oPpadding, null, oPpadding+corner*2, oPpadding+corner*2).done());
    rootElement.appendChild(ElementSelection.boxSegment(this.handler(SelectionActionType.Resize_NE), 'ne-resize', null, -oPpadding, -oPpadding, null, oPpadding+corner*2, oPpadding+corner*2).done());
    rootElement.appendChild(ElementSelection.boxSegment(this.handler(SelectionActionType.Resize_SW), 'sw-resize', -oPpadding, null, null, -oPpadding, oPpadding+corner*2, oPpadding+corner*2).done());
    rootElement.appendChild(ElementSelection.boxSegment(this.handler(SelectionActionType.Resize_SE), 'se-resize', null, -oPpadding, null, -oPpadding, oPpadding+corner*2, oPpadding+corner*2).done());
    return rootElement;
  }

  private handler(type: SelectionActionType) {
    return event => {
      event.preventDefault();
      return this.handleSelection(type, event);
    }
  }

  private handleSelection(type: SelectionActionType, coordinates: PageCoordinates): boolean {
    return this.eventHandler(this, type, coordinates);
  }

  getTarget(): HTMLElement {
    return this.target;
  }

  updateTarget() {
    let t = HTMLElementChmod.of(this.target);
    HTMLElementChmod.of(this.htmlElement)
      .setCoordinates(t.left, t.top)
      .setSize(t.width, t.height);
  }

  attach(element: HTMLElement) {
    element.appendChild(this.htmlElement);
  }

  remove() {
    this.htmlElement.remove();
  }

}
