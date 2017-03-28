import { HTMLElementChmod, HTMLElementTransformer } from '../shared/HTMLElement';
import { Position2D } from '../shared/Position2D';

export interface DraggableItem {

  getRootlessCopy(): DraggableItem;

  getDom(): HTMLElement;
  getParent(): DraggableItem;
  getChmod(): HTMLElementChmod;
  getTransformer(): HTMLElementTransformer;

  enableDrag();
  isDragEnabled(): boolean;

  show();
  hide();
  isVisible(): boolean;

  makeChildOf(draggableItem: DraggableItem);
  remove();

  moveToPosition(position: Position2D, lastPosition: Position2D): Position2D;
  moveWallTo(position: Position2D, lastPosition: Position2D, resizeType: string): Position2D;

}
