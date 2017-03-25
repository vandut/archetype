import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HTMLElementTransformer } from '../../../shared/HTMLElement';
import { DragService } from '../../../drag/drag.service';
import { DragEventListenerWrapper, DragEventListener } from '../../../drag/DragEventListener';
import { Position2D } from '../../../shared/Position2D';
import { HammerSupport } from '../../../drag/HammerSupport';
import { DraggableItemImpl } from '../../../drag/DraggableItem';

@Component({
  selector: 'editor-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements AfterViewInit {

  public _target: HTMLElement;

  public transformer: HTMLElementTransformer;

  @Input()
  public set target(element: HTMLElement) {
    this._target = element;
    this.transformer = HTMLElementTransformer.of(element);
  }

  @ViewChild('background') private background: ElementRef;
  @ViewChild('resizeN')    private resizeN: ElementRef;
  @ViewChild('resizeS')    private resizeS: ElementRef;
  @ViewChild('resizeW')    private resizeW: ElementRef;
  @ViewChild('resizeE')    private resizeE: ElementRef;
  @ViewChild('resizeNW')   private resizeNW: ElementRef;
  @ViewChild('resizeNE')   private resizeNE: ElementRef;
  @ViewChild('resizeSW')   private resizeSW: ElementRef;
  @ViewChild('resizeSE')   private resizeSE: ElementRef;

  constructor(private dragService: DragService) {}

  ngAfterViewInit() {
    HammerSupport.registerDragEventListener(this.background.nativeElement, new SelectionTargetDragListener(this.dragService,   this));
    HammerSupport.registerDragEventListener(this.resizeN.nativeElement,    new SelectionTargetDragListener(this.dragService, this, 'Resize_N'));
    HammerSupport.registerDragEventListener(this.resizeS.nativeElement,    new SelectionTargetDragListener(this.dragService, this, 'Resize_S'));
    HammerSupport.registerDragEventListener(this.resizeW.nativeElement,    new SelectionTargetDragListener(this.dragService, this, 'Resize_W'));
    HammerSupport.registerDragEventListener(this.resizeE.nativeElement,    new SelectionTargetDragListener(this.dragService, this, 'Resize_E'));
    HammerSupport.registerDragEventListener(this.resizeNW.nativeElement,   new SelectionTargetDragListener(this.dragService, this, 'Resize_NW'));
    HammerSupport.registerDragEventListener(this.resizeNE.nativeElement,   new SelectionTargetDragListener(this.dragService, this, 'Resize_NE'));
    HammerSupport.registerDragEventListener(this.resizeSW.nativeElement,   new SelectionTargetDragListener(this.dragService, this, 'Resize_SW'));
    HammerSupport.registerDragEventListener(this.resizeSE.nativeElement,   new SelectionTargetDragListener(this.dragService, this, 'Resize_SE'));
  }

  public isMovable(): boolean {
    return this.transformer.positionType !== 'static';
  }

  public isResizable(): boolean {
    return getComputedStyle(this._target).display === 'block';
  }

}

class SelectionTargetDragListener extends DragEventListenerWrapper {

  constructor(listener: DragEventListener,
              private selectionComponent: SelectionComponent,
              private customResizeType?: string) {
    super(listener);
  }

  public onTap(draggableItem: DraggableItemImpl, position: Position2D) {
    const delegate = new DraggableItemImpl(this.selectionComponent._target);
    super.onTap(delegate, position);
  }

  public onPanStart(draggableItem: DraggableItemImpl, position: Position2D, resizeType: string) {
    const delegate = new DraggableItemImpl(this.selectionComponent._target);
    super.onPanStart(delegate, position, this.customResizeType);
  }

  public onPanMove(position: Position2D) {
    super.onPanMove(position);
  }

  public onPanEnd(position: Position2D) {
    super.onPanEnd(position);
  }

  public onPanCancel(position: Position2D) {
    super.onPanCancel(position);
  }

}
