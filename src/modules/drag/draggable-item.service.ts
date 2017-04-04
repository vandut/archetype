import { Injectable } from '@angular/core';
import { DraggableItem, Sizer } from './DraggableItem';
import { HTMLElementChmod, HTMLElementFactory, HTMLElementTransformer } from '../shared/HTMLElement';
import { ElementRepositoryHelper } from '../app/services/element-repository.service';
import { Position2D } from '../shared/Position2D';

@Injectable()
export class DraggableItemService {

  public createDraggableItemFromTemplate(template: string): DraggableItem {
    const target = HTMLElementFactory.fromTemplate(template);
    return new DraggableItemImpl(target, null);
  }

  public getDraggableItem(target: HTMLElement | EventTarget): DraggableItem {
    const parentElement = this.findTargetParent(<HTMLElement> target);
    const parentItem = parentElement === null ? null : new DraggableItemImpl(parentElement, null);
    return new DraggableItemImpl(<HTMLElement> target, parentItem);
  }

  private findTargetParent(target: HTMLElement): HTMLElement {
    if (ElementRepositoryHelper.getIsChildOf(target)) {
      let parent = target.parentElement;
      while (parent !== null) {
        if (ElementRepositoryHelper.getIsParentFor(parent) === ElementRepositoryHelper.getIsChildOf(target)) {
          return parent;
        }
        parent = parent.parentElement;
      }
    }
    return null;
  }

}

class DraggableItemImpl implements DraggableItem {

  public static ATTR_NAME_DRAGGABLE = 'draggable';

  private chmod: HTMLElementChmod;
  private transformer: HTMLElementTransformer;
  public readonly sizer: Sizer;

  constructor(private dom: HTMLElement, private parent: DraggableItem) {
    this.chmod = HTMLElementChmod.of(dom);
    this.transformer = HTMLElementTransformer.of(dom);
    this.sizer = new SizerImpl(dom);
  }

  public getRootlessCopy(): DraggableItem {
    return new DraggableItemImpl(<HTMLElement> this.getDom().cloneNode(true), null);
  }

  public getDom(): HTMLElement {
    return this.dom;
  }

  public getParent(): DraggableItem {
    return this.parent;
  }

  public getChmod(): HTMLElementChmod {
    return this.chmod;
  }

  public getTransformer(): HTMLElementTransformer {
    return this.transformer;
  }

  public getData(key: string): string {
    return this.dom.dataset[key];
  }

  public enableDrag(){
    this.dom.dataset[DraggableItemImpl.ATTR_NAME_DRAGGABLE] = 'true';
  }

  public isDragEnabled(): boolean {
    return this.dom.dataset[DraggableItemImpl.ATTR_NAME_DRAGGABLE] === 'true';
  }

  public show()  {
    this.dom.style.visibility = null;
  }

  public hide()  {
    this.dom.style.visibility = 'hidden';
  }

  public isVisible(): boolean {
    return !this.dom.style.visibility;
  }

  public isMovable(): boolean {
    return this.transformer.positionType !== 'static';
  }

  public isResizable(): boolean {
    return getComputedStyle(this.dom).display === 'block';
  }

  public makeChildOf(draggableItem: DraggableItem) {
    draggableItem.getDom().appendChild(this.dom);
  }

  public remove() {
    this.dom.remove();
  }

  public moveToPosition(position: Position2D, lastPosition: Position2D): Position2D {
    if (lastPosition === null) {
      this.sizer.left = position.x;
      this.sizer.top = position.y;
      return null;
    }

    this.sizer.left += position.x - lastPosition.x;
    this.sizer.top += position.y - lastPosition.y;

    if (!this.parent) {
      return position;
    }

    const adjustedLeft = Math.min(Math.max(0, this.sizer.left), this.parent.getChmod().innerWidth - this.sizer.width);
    const adjustedTop = Math.min(Math.max(0, this.sizer.top), this.parent.getChmod().innerHeight - this.sizer.height);
    const last = {
      x: position.x + adjustedLeft - this.sizer.left,
      y: position.y + adjustedTop - this.sizer.top
    };
    this.sizer.left = adjustedLeft;
    this.sizer.top = adjustedTop;
    return last;
  }

  public moveWallTo(position: Position2D, lastPosition: Position2D, resizeType: string): Position2D {
    if (!this.parent) {
      console.warn('Parent undefined');
      return position;
    }

    let deltaX = position.x - lastPosition.x;
    let deltaY = position.y - lastPosition.y;

    switch (resizeType) {
      case 'Resize_W':
      case 'Resize_NW':
      case 'Resize_SW':
        deltaX = Math.max(0, this.sizer.left + deltaX) - this.sizer.left + Math.min(0, this.sizer.width - deltaX);
        break;
      case 'Resize_E':
      case 'Resize_NE':
      case 'Resize_SE':
        deltaX = Math.round(Math.min(this.parent.getChmod().clientRect.width, this.sizer.left + this.sizer.width + deltaX)
            - (this.sizer.left + this.sizer.width)) - Math.min(0, this.sizer.width + deltaX);
        break;
    }

    switch (resizeType) {
      case 'Resize_N':
      case 'Resize_NW':
      case 'Resize_NE':
        deltaY = Math.max(0, this.sizer.top + deltaY) - this.sizer.top + Math.min(0, this.sizer.height - deltaY);
        break;
      case 'Resize_S':
      case 'Resize_SW':
      case 'Resize_SE':
        deltaY = Math.round(Math.min(this.parent.getChmod().clientRect.height, this.sizer.top + this.sizer.height + deltaY)
            - (this.sizer.top + this.sizer.height)) - Math.min(0, this.sizer.height + deltaY);
        break;
    }

    switch (resizeType) {
      case 'Resize_N':
      case 'Resize_NW':
      case 'Resize_NE':
        this.sizer.top += deltaY;
        this.sizer.height -= deltaY;
        break;
      case 'Resize_S':
      case 'Resize_SW':
      case 'Resize_SE':
        this.sizer.height += deltaY;
        break;
    }

    switch (resizeType) {
      case 'Resize_W':
      case 'Resize_NW':
      case 'Resize_SW':
        this.sizer.left += deltaX;
        this.sizer.width -= deltaX;
        break;
      case 'Resize_E':
      case 'Resize_NE':
      case 'Resize_SE':
        this.sizer.width += deltaX;
        break;
    }

    return {
      x: lastPosition.x + deltaX,
      y: lastPosition.y + deltaY
    };
  }

}

abstract class Css {

  public abstract get style(): CSSStyleDeclaration;

  public get width(): number   { return Css.getPx(this.style.width); }
  public get height(): number  { return Css.getPx(this.style.height); }

  public set width(value: number)   { this.style.width  = Css.setPx(value); }
  public set height(value: number)  { this.style.height = Css.setPx(value); }


  public get left(): number   { return Css.getPx(this.style.left); }
  public get right(): number  { return Css.getPx(this.style.right); }
  public get top(): number    { return Css.getPx(this.style.top); }
  public get bottom(): number { return Css.getPx(this.style.bottom); }

  public set left(value: number)   { this.style.left   = Css.setPx(value); }
  public set right(value: number)  { this.style.right  = Css.setPx(value); }
  public set top(value: number)    { this.style.top    = Css.setPx(value); }
  public set bottom(value: number) { this.style.bottom = Css.setPx(value); }


  public get marginLeft(): number   { return Css.getPx(this.style.marginLeft); }
  public get marginRight(): number  { return Css.getPx(this.style.marginRight); }
  public get marginTop(): number    { return Css.getPx(this.style.marginTop); }
  public get marginBottom(): number { return Css.getPx(this.style.marginBottom); }

  public set marginLeft(value: number)   { this.style.marginLeft   = Css.setPx(value); }
  public set marginRight(value: number)  { this.style.marginRight  = Css.setPx(value); }
  public set marginTop(value: number)    { this.style.marginTop    = Css.setPx(value); }
  public set marginBottom(value: number) { this.style.marginBottom = Css.setPx(value); }

  private static getPx(value: string): number | null {
    return value == null ? null : Number(value.slice(0, -2));
  }

  private static setPx(value: number): string | null {
    return value == null ? null : value + 'px';
  }

}

class RealCss extends Css {
  constructor(private dom: HTMLElement) { super(); }
  public get style(): CSSStyleDeclaration { return this.dom.style; }
}

class ComputedCss extends Css {
  constructor(private dom: HTMLElement) { super(); }
  public get style(): CSSStyleDeclaration { return window.getComputedStyle(this.dom); }
}

/*
 * Note: this does not count transformation like rotation or scaling.
 */
class SizerImpl implements Sizer {

  private css: Css;
  private computedCss: Css;

  constructor(private dom: HTMLElement) {
    this.css = new RealCss(dom);
    this.computedCss = new ComputedCss(dom);
  }

  get left(): number {
    return this.dom.offsetLeft;
  }

  set left(left: number) {
    if (left == null) {
      this.css.left = null;
      this.css.marginLeft = null;
    } else {
      this.right = null;
      if (this.computedCss.style.position === 'static') {
        this.css.marginLeft = left + this.css.marginLeft - this.left;
      } else {
        this.css.left = left + this.css.left - this.left;
      }
    }
  }

  get right(): number {
    return this.computedCss.right + this.computedCss.marginRight;
  }

  set right(right: number) {
    if (right == null) {
      this.css.right = null;
      this.css.marginRight = null;
    } else {
      this.left = null;
      if (this.computedCss.style.position === 'static') {
        this.css.marginRight = right + this.css.marginRight - this.right;
      } else {
        this.css.right = right + this.css.right - this.right;
      }
    }
  }

  get top(): number {
    return this.dom.offsetTop;
  }

  set top(top: number) {
    if (top == null) {
      this.css.top = null;
      this.css.marginTop = null;
    } else {
      this.bottom = null;
      if (this.computedCss.style.position === 'static') {
        this.css.marginTop = top + this.css.marginTop - this.top;
      } else {
        this.css.top = top + this.css.top - this.top;
      }
    }
  }

  get bottom(): number {
    return this.computedCss.bottom + this.computedCss.marginBottom;
  }

  set bottom(bottom: number) {
    if (bottom == null) {
      this.css.bottom = null;
      this.css.marginBottom = null;
    } else {
      this.top = null;
      if (this.computedCss.style.position === 'static') {
        this.css.marginBottom = bottom + this.css.marginBottom - this.bottom;
      } else {
        this.css.bottom = bottom + this.css.bottom - this.bottom;
      }
    }
  }

  get width(): number {
    return this.dom.offsetWidth;
  }

  set width(width: number) {
    this.css.width = width + this.css.width - this.width;
  }

  get height(): number {
    return this.dom.offsetHeight;
  }

  set height(height: number) {
    this.css.height = height + this.css.height - this.height;
  }

}
