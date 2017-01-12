export interface MouseMoveEventsListener {
  onMouseMove: (event: MouseEvent) => any;
  onMouseEntered: (event: MouseEvent) => any;
  onMouseLeft: (event: MouseEvent) => any;
}

export class MouseMoveEventsMixin {

  static register(element: HTMLElement, listener: MouseMoveEventsListener) {
    element.addEventListener('mousemove',  e => listener.onMouseMove(e), false);
    element.addEventListener('mouseenter', e => listener.onMouseEntered(e));
    element.addEventListener('mouseleave', e => listener.onMouseLeft(e));
  }

}
