import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HTMLElementTransformer } from '../../../shared/HTMLElement';
import { DragMoveService } from '../../../drag/drag-move.service';
import { DragResizeService } from '../../../drag/drag-resize.service';
import { ForwardingDragMoveEventListener } from '../../../drag/DragMoveEventListener';
import { DragBaseService } from '../../../drag/drag-base.service';

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
    DragMoveService.registerMoveListeners(this.background.nativeElement, new SelectionTargetDragMoveListener(this.dragMoveService,   this, 'Move'));
    DragMoveService.registerMoveListeners(this.resizeN.nativeElement,    new SelectionTargetDragMoveListener(this.dragResizeService, this, 'Resize_N'));
    DragMoveService.registerMoveListeners(this.resizeS.nativeElement,    new SelectionTargetDragMoveListener(this.dragResizeService, this, 'Resize_S'));
    DragMoveService.registerMoveListeners(this.resizeW.nativeElement,    new SelectionTargetDragMoveListener(this.dragResizeService, this, 'Resize_W'));
    DragMoveService.registerMoveListeners(this.resizeE.nativeElement,    new SelectionTargetDragMoveListener(this.dragResizeService, this, 'Resize_E'));
    DragMoveService.registerMoveListeners(this.resizeNW.nativeElement,   new SelectionTargetDragMoveListener(this.dragResizeService, this, 'Resize_NW'));
    DragMoveService.registerMoveListeners(this.resizeNE.nativeElement,   new SelectionTargetDragMoveListener(this.dragResizeService, this, 'Resize_NE'));
    DragMoveService.registerMoveListeners(this.resizeSW.nativeElement,   new SelectionTargetDragMoveListener(this.dragResizeService, this, 'Resize_SW'));
    DragMoveService.registerMoveListeners(this.resizeSE.nativeElement,   new SelectionTargetDragMoveListener(this.dragResizeService, this, 'Resize_SE'));
  }

  public isMovable(): boolean {
    return this.transformer.positionType !== 'static';
  }

  public isResizable(): boolean {
    return getComputedStyle(this._target).display === 'block';
  }

}

class SelectionTargetDragMoveListener extends ForwardingDragMoveEventListener {

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

  public onPanMove(target: HTMLElement, point: HammerPoint, data: any) {
    super.onPanMove(this.selectionComponent._target, point, this.customData);
  }

  public onPanEnd(target: HTMLElement, point: HammerPoint, data: any) {
    super.onPanEnd(this.selectionComponent._target, point, this.customData);
  }

  public onPanCancel(target: HTMLElement, point: HammerPoint, data: any) {
    super.onPanCancel(this.selectionComponent._target, point, this.customData);
  }

}
