import { Component, HostListener } from '@angular/core';

export declare type ValueProvider<T> = () => T;

export declare type ValueConsumer<T> = (T) => void;

export class SwitchableStrategy {

  private _switchStrategyCallback: ValueConsumer<SwitchableStrategy>;

  set switchStrategyCallback(callback: ValueConsumer<SwitchableStrategy>) {
    this._switchStrategyCallback = callback;
  }

  protected switchStrategyTo(strategy: SwitchableStrategy) {
    if (!this._switchStrategyCallback) {
      throw new Error('Missing Switch Strategy Callback');
    }
    this._switchStrategyCallback(strategy);
  }

}

@Component({})
export class SwitchableStrategyComponent<Strategy extends SwitchableStrategy> {

  private currentStrategy: Strategy;
  private switchStrategyCallback: ValueConsumer<Strategy> = strategy => this.switchStrategyTo(strategy);

  protected registerSwitchableStrategy(strategy: Strategy) {
    strategy.switchStrategyCallback = this.switchStrategyCallback;
  }

  protected switchStrategyTo(strategy: Strategy) {
    this.currentStrategy = strategy;
  }

  protected getCurrentStrategy(): Strategy {
    return this.currentStrategy;
  }

}

export class LocalInputEventsStrategy extends SwitchableStrategy {

  public onLocalMouseEnter(event: MouseEvent): boolean {
    return true;
  }

  public onLocalMouseLeave(event: MouseEvent): boolean {
    return true;
  }

  public onLocalMouseMove(event: MouseEvent): boolean {
    return true;
  }

  public onLocalMouseDown(event: MouseEvent): boolean {
    return true;
  }

  public onLocalMouseUp(event: MouseEvent): boolean {
    return true;
  }

}

@Component({})
export class LocalInputEventsStrategyComponent<Strategy extends LocalInputEventsStrategy> extends SwitchableStrategyComponent<Strategy> {

  @HostListener('mouseenter', ['$event'])
  protected onLocalMouseEnter(event: MouseEvent) {
    return this.getCurrentStrategy().onLocalMouseEnter(event);
  }

  @HostListener('mouseleave', ['$event'])
  protected onLocalMouseLeave(event: MouseEvent) {
    return this.getCurrentStrategy().onLocalMouseLeave(event);
  }

  @HostListener('mousemove', ['$event'])
  protected onLocalMouseMove(event: MouseEvent) {
    return this.getCurrentStrategy().onLocalMouseMove(event);
  }

  @HostListener('mousedown', ['$event'])
  protected oLocalMouseDown(event: MouseEvent) {
    return this.getCurrentStrategy().onLocalMouseDown(event);
  }

  @HostListener('mouseup', ['$event'])
  protected onLocalMouseUp(event: MouseEvent) {
    return this.getCurrentStrategy().onLocalMouseUp(event);
  }

}

export class GlobalInputEventsStrategy extends LocalInputEventsStrategy {

  public onGlobalMouseDown(event: MouseEvent): boolean {
    return true;
  }

  public onGlobalMouseUp(event: MouseEvent): boolean {
    return true;
  }

}

@Component({})
export class GlobalInputEventsStrategyComponent<Strategy extends GlobalInputEventsStrategy> extends LocalInputEventsStrategyComponent<Strategy> {

  @HostListener('document:mousedown', ['$event'])
  protected onGlobalMouseDown(event: MouseEvent) {
    return this.getCurrentStrategy().onGlobalMouseDown(event);
  }

  @HostListener('document:mouseup', ['$event'])
  protected onGlobalMouseUp(event: MouseEvent) {
    return this.getCurrentStrategy().onGlobalMouseUp(event);
  }

}
