import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DragService } from '../../../drag/drag.service';
import { DragEventListenerWrapper, DragEventListener } from '../../../drag/DragEventListener';
import { Position2D } from '../../../shared/Position2D';
import { HammerSupport } from '../../../drag/HammerSupport';
import { DraggableItem } from '../../../drag/DraggableItem';
import { DraggableItemService } from '../../../drag/draggable-item.service';

@Component({
  selector: 'editor-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements AfterViewInit {

  public selectionTarget: DraggableItem;

  @Input()
  public set target(element: HTMLElement) {
    this.selectionTarget = this.draggableItemService.getDraggableItem(element);
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

  constructor(private dragService: DragService, private draggableItemService: DraggableItemService) {}

  ngAfterViewInit() {
    HammerSupport.registerDragEventListener(this.getDraggableItem(this.background), new SelectionTargetDragListener(this.dragService, this));
    HammerSupport.registerDragEventListener(this.getDraggableItem(this.resizeN),    new SelectionTargetDragListener(this.dragService, this, 'Resize_N'));
    HammerSupport.registerDragEventListener(this.getDraggableItem(this.resizeS),    new SelectionTargetDragListener(this.dragService, this, 'Resize_S'));
    HammerSupport.registerDragEventListener(this.getDraggableItem(this.resizeW),    new SelectionTargetDragListener(this.dragService, this, 'Resize_W'));
    HammerSupport.registerDragEventListener(this.getDraggableItem(this.resizeE),    new SelectionTargetDragListener(this.dragService, this, 'Resize_E'));
    HammerSupport.registerDragEventListener(this.getDraggableItem(this.resizeNW),   new SelectionTargetDragListener(this.dragService, this, 'Resize_NW'));
    HammerSupport.registerDragEventListener(this.getDraggableItem(this.resizeNE),   new SelectionTargetDragListener(this.dragService, this, 'Resize_NE'));
    HammerSupport.registerDragEventListener(this.getDraggableItem(this.resizeSW),   new SelectionTargetDragListener(this.dragService, this, 'Resize_SW'));
    HammerSupport.registerDragEventListener(this.getDraggableItem(this.resizeSE),   new SelectionTargetDragListener(this.dragService, this, 'Resize_SE'));
  }

  private getDraggableItem(target: ElementRef) {
    return this.draggableItemService.getDraggableItem(target.nativeElement);
  }

  public isMovable(): boolean {
    return this.selectionTarget.getTransformer().positionType !== 'static';
  }

  public isResizable(): boolean {
    return getComputedStyle(this.selectionTarget.getDom()).display === 'block';
  }

}

class SelectionTargetDragListener extends DragEventListenerWrapper {

  constructor(listener: DragEventListener,
              private selectionComponent: SelectionComponent,
              private customResizeType?: string) {
    super(listener);
  }

  public onTap(draggableItem: DraggableItem, position: Position2D) {
    super.onTap(this.selectionComponent.selectionTarget, position);
  }

  public onPanStart(draggableItem: DraggableItem, position: Position2D, resizeType?: string) {
    super.onPanStart(this.selectionComponent.selectionTarget, position, this.customResizeType);
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
