import { Component, HostListener } from '@angular/core';

export class InputEventsStrategy {

  public onLocalMouseEnter(event: MouseEvent): boolean {
    return true;
  }

  public onLocalMouseLeave(event: MouseEvent): boolean {
    return true;
  }

  public onLocalMouseMove(event: MouseEvent): boolean {
    return true;
  }

  public onGlobalMouseDown(event: MouseEvent): boolean {
    return true;
  }

  public onGlobalMouseUp(event: MouseEvent): boolean {
    return true;
  }

}

export declare type SwitchStrategyCallback = (InputEventsStrategy) => void;

export class SwitchableInputEventsStrategy extends InputEventsStrategy {

  private _switchStrategyCallback: SwitchStrategyCallback;

  set switchStrategyCallback(callback: SwitchStrategyCallback) {
    this._switchStrategyCallback = callback;
  }

  protected switchStrategyTo(strategy: InputEventsStrategy) {
    if (!this._switchStrategyCallback) {
      throw new Error('Missing Switch Strategy Callback');
    }
    this._switchStrategyCallback(strategy);
  }

}

@Component({})
export class InputEventsStrategyComponent {

  private currentStrategy: InputEventsStrategy;
  private switchStrategyCallback: SwitchStrategyCallback = strategy => this.switchStrategyTo(strategy);

  protected registerStrategy(strategy: SwitchableInputEventsStrategy) {
    strategy.switchStrategyCallback = this.switchStrategyCallback;
  }

  protected switchStrategyTo(strategy: InputEventsStrategy) {
    this.currentStrategy = strategy;
  }

  @HostListener('mouseenter', ['$event'])
  protected onMouseEnter(event: MouseEvent) {
    return this.currentStrategy.onLocalMouseEnter(event);
  }

  @HostListener('mouseleave', ['$event'])
  protected onMouseLeave(event: MouseEvent) {
    return this.currentStrategy.onLocalMouseLeave(event);
  }

  @HostListener('mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent) {
    return this.currentStrategy.onLocalMouseMove(event);
  }

  @HostListener('document:mousedown', ['$event'])
  protected onGlobalMouseDown(event: MouseEvent) {
    return this.currentStrategy.onGlobalMouseDown(event);
  }

  @HostListener('document:mouseup', ['$event'])
  protected onGlobalMouseUp(event: MouseEvent) {
    return this.currentStrategy.onGlobalMouseUp(event);
  }

}
