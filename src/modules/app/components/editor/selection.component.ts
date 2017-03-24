import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HTMLElementTransformer } from '../../../shared/HTMLElement';
import { DragMoveService } from '../../../drag/drag-move.service';
import { DragResizeService } from '../../../drag/drag-resize.service';
import { ForwardingDragEventListener } from '../../../drag/DragEventListener';
import { DragBaseService } from '../../../drag/drag-base.service';
import { Position2D } from '../../../shared/Position2D';
import { HammerSupport } from '../../../drag/HammerSupport';

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

  constructor(private dragMoveService: DragMoveService,
              private dragResizeService: DragResizeService) {}

  ngAfterViewInit() {
    HammerSupport.registerDragEventListener(this.background.nativeElement, new SelectionTargetDragListener(this.dragMoveService,   this, 'Move'));
    HammerSupport.registerDragEventListener(this.resizeN.nativeElement,    new SelectionTargetDragListener(this.dragResizeService, this, 'Resize_N'));
    HammerSupport.registerDragEventListener(this.resizeS.nativeElement,    new SelectionTargetDragListener(this.dragResizeService, this, 'Resize_S'));
    HammerSupport.registerDragEventListener(this.resizeW.nativeElement,    new SelectionTargetDragListener(this.dragResizeService, this, 'Resize_W'));
    HammerSupport.registerDragEventListener(this.resizeE.nativeElement,    new SelectionTargetDragListener(this.dragResizeService, this, 'Resize_E'));
    HammerSupport.registerDragEventListener(this.resizeNW.nativeElement,   new SelectionTargetDragListener(this.dragResizeService, this, 'Resize_NW'));
    HammerSupport.registerDragEventListener(this.resizeNE.nativeElement,   new SelectionTargetDragListener(this.dragResizeService, this, 'Resize_NE'));
    HammerSupport.registerDragEventListener(this.resizeSW.nativeElement,   new SelectionTargetDragListener(this.dragResizeService, this, 'Resize_SW'));
    HammerSupport.registerDragEventListener(this.resizeSE.nativeElement,   new SelectionTargetDragListener(this.dragResizeService, this, 'Resize_SE'));
  }

  public isMovable(): boolean {
    return this.transformer.positionType !== 'static';
  }

  public isResizable(): boolean {
    return getComputedStyle(this._target).display === 'block';
  }

}

class SelectionTargetDragListener extends ForwardingDragEventListener {

  constructor(dragBaseService: DragBaseService,
              private selectionComponent: SelectionComponent,
              private customData: any) {
    super(dragBaseService);
  }

  public onTap(target: HTMLElement, point: HammerPoint, data: any) {
    super.onTap(this.selectionComponent._target, point, this.customData);
  }

  public onPanStart(target: HTMLElement, point: HammerPoint, data: any) {
    super.onPanStart(this.selectionComponent._target, point, this.customData);
  }

  public onPanMove(point: Position2D) {
    super.onPanMove(point);
  }

  public onPanEnd(point: HammerPoint) {
    super.onPanEnd(point);
  }

  public onPanCancel(point: HammerPoint) {
    super.onPanCancel(point);
  }

}
