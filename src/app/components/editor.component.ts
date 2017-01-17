import { Component, ViewChild, ElementRef } from '@angular/core';
import { SnappingGridComponent } from './snapping-grid.component';
import { ElementCompositorComponent } from './element-compositor.component';
import { ElementSelectionComponent } from './element-selection.component';
import { PageCoordinates } from '../utils/PageCoordinates';
import { SelectionMessage, SelectionActionType, TargetSelection } from './selection';
import { GlobalInputEventsStrategy, GlobalInputEventsStrategyComponent, ValueProvider } from './strategy';
import { HTMLElementChmod } from '../utils/HTMLElement';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent extends GlobalInputEventsStrategyComponent<GlobalInputEventsStrategy> {

  @ViewChild(SnappingGridComponent)
  private snappingGrid: SnappingGridComponent;

  @ViewChild(ElementCompositorComponent)
  private elementCompositor: ElementCompositorComponent;

  @ViewChild(ElementSelectionComponent)
  private selectionLayer: ElementSelectionComponent;

  private nopStrategy = new GlobalInputEventsStrategy();
  private resizeStrategy = new ResizeStrategy(this.nopStrategy);

  private originRectProvider: ValueProvider<ClientRect> = () => this.elementRef.nativeElement.getBoundingClientRect();

  constructor(private elementRef: ElementRef) {
    super();
    this.registerSwitchableStrategy(this.nopStrategy);
    this.registerSwitchableStrategy(this.resizeStrategy);
    this.switchStrategyTo(this.nopStrategy);
  }

  isPageCoordinatesInside(coordinates: PageCoordinates): boolean {
    return this.elementCompositor.isPageCoordinatesInsideComponent(coordinates);
  }

  addElement(template: string, coordinates: PageCoordinates) {
    let element = this.elementCompositor.addElement(template, coordinates);
    this.selectionLayer.selectTarget(element);
  }

  clearSelection() {
    this.selectionLayer.clearSelection();
  }

  onElementSelected(element: HTMLElement) {
    if (element) {
      this.selectionLayer.selectTarget(element);
    } else {
      this.selectionLayer.clearSelection();
    }
  }

  onSelectAction(message: SelectionMessage) {
    switch (message.action) {
      case SelectionActionType.Move:
        // TODO: to implement
        break;
      case SelectionActionType.Resize_N:
      case SelectionActionType.Resize_S:
      case SelectionActionType.Resize_W:
      case SelectionActionType.Resize_E:
      case SelectionActionType.Resize_NW:
      case SelectionActionType.Resize_NE:
      case SelectionActionType.Resize_SW:
      case SelectionActionType.Resize_SE:
        this.switchStrategyTo(this.resizeStrategy);
        this.resizeStrategy.beginResize(message.target, message.action, this.originRectProvider);
        break;
    }
  }

}

class ResizeStrategy extends GlobalInputEventsStrategy {

  private activity: ResizeActivity = null;

  constructor(private nopStrategy: GlobalInputEventsStrategy) {
    super();
  }

  beginResize(ts: TargetSelection, action: SelectionActionType, originRectProvider: ValueProvider<ClientRect>) {
    this.activity = new ResizeActivity(ts, action, originRectProvider);
  }

  onLocalMouseMove(event: MouseEvent): boolean {
    this.activity.apply(event);
    return false;
  }

  onLocalMouseUp(event: MouseEvent): boolean {
    this.activity.apply(event);
    this.activity = null;
    return false;
  }

  onGlobalMouseUp(event: MouseEvent): boolean {
    if (this.activity) {
      // Consider should we revert when activity did not stop inside
      // this.activity.revert();
      this.activity = null;
    }
    this.switchStrategyTo(this.nopStrategy);
    return false;
  }

}

class ResizeActivity {

  private htmlElement: HTMLElement;
  private chmod: HTMLElementChmod;

  private originalProperties;

  constructor(private selection: TargetSelection, private action: SelectionActionType, private originRectProvider: ValueProvider<ClientRect>) {
    this.htmlElement = selection.getTarget();
    this.chmod = HTMLElementChmod.of(this.htmlElement);
    this.originalProperties = {
      x: this.chmod.left,
      y: this.chmod.top,
      w: this.chmod.width,
      h: this.chmod.height
    }
  }

  get rect(): ClientRect {
    return this.htmlElement.getBoundingClientRect();
  }

  get originRect(): ClientRect {
    return this.originRectProvider();
  }

  set left(l: number) {
    if (this.chmod.width + this.chmod.left - l >= 0) {
      this.chmod.width = this.chmod.width + this.chmod.left - l;
      this.chmod.left = l;
    }
  }

  set top(t: number) {
    if (this.chmod.height + this.chmod.top - t >= 0) {
      this.chmod.height = this.chmod.height + this.chmod.top - t;
      this.chmod.top = t;
    }
  }

  set width(w: number) {
    this.chmod.width = w;
  }

  set height(h: number) {
    this.chmod.height = h;
  }

  apply(coordinates: PageCoordinates) {
    let l = coordinates.pageX - this.originRect.left;
    let t = coordinates.pageY - this.originRect.top;
    let w = coordinates.pageX - this.rect.left;
    let h = coordinates.pageY - this.rect.top;

    switch (this.action) {
      case SelectionActionType.Resize_N:
        this.top = t;
        break;
      case SelectionActionType.Resize_S:
        this.height = h;
        break;
      case SelectionActionType.Resize_W:
        this.left = l;
        break;
      case SelectionActionType.Resize_E:
        this.width = w;
        break;
      case SelectionActionType.Resize_NW:
        this.top = t;
        this.left = l;
        break;
      case SelectionActionType.Resize_NE:
        this.top = t;
        this.width = w;
        break;
      case SelectionActionType.Resize_SW:
        this.height = h;
        this.left = l;
        break;
      case SelectionActionType.Resize_SE:
        this.height = h;
        this.width = w;
        break;
      default:
        return;
    }

    this.selection.updateTarget();
  }

  revert() {
    this.chmod.left = this.originalProperties.x;
    this.chmod.top = this.originalProperties.y;
    this.chmod.width = this.originalProperties.w;
    this.chmod.height = this.originalProperties.h;
    this.selection.updateTarget();
  }

}
