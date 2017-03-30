import { HTMLElementChmod, HTMLElementTransformer } from '../shared/HTMLElement';
import { Position2D } from '../shared/Position2D';

// TODO: Add HTML manipulation classes: Positioner, Resizer, Styler
export interface DraggableItem {

  readonly sizer: Sizer;

  getRootlessCopy(): DraggableItem;

  getDom(): HTMLElement;
  getParent(): DraggableItem;
  getChmod(): HTMLElementChmod;
  getTransformer(): HTMLElementTransformer;

  getData(key: string): string;

  enableDrag();
  isDragEnabled(): boolean;

  show();
  hide();
  isVisible(): boolean;

  isMovable(): boolean;
  isResizable(): boolean;

  makeChildOf(draggableItem: DraggableItem);
  remove();

  moveToPosition(position: Position2D, lastPosition: Position2D): Position2D;
  moveWallTo(position: Position2D, lastPosition: Position2D, resizeType: string): Position2D;

}

/**
 * Represents WYSIWYG properties of the element: real position calculated from existing styles.
 * This includes:
 *   * absolute positioning
 *   * relative positioning
 *   * margins
 *   * borders
 */
export interface Sizer {

  /**
   * Distance of the left wall from the parents left wall.
   */
  left: number;

  /**
   * Distance of the right wall from the parents right wall.
   */
  right: number;

  /**
   * Distance of the top wall from the parents top wall.
   */
  top: number;

  /**
   * Distance of the bottom wall from the parents bottom wall.
   */
  bottom: number;

  /**
   * Total element width.
   */
  width: number;

  /**
   * Total element height.
   */
  height: number;

}

export interface Mover {

  /**
   * Move element absolutely but not outside given rect
   * @param position new position coordinates
   * @param rect restricting rectangle
   * @return calculated position, may be different than requested
   */
  moveAbsolutely(position: Position2D, rect: ClientRect): Position2D;

  /**
   * Move element relatively but not outside given rect
   * @param diff change relatively to existing position
   * @param rect restricting rectangle
   * @return calculated position, may be different than requested
   */
  moveRelatively(diff: Position2D, rect: ClientRect): Position2D;

}
