import { makePropDecorator } from '@angular/core/src/util/decorators';
import { HostListener } from '@angular/core';

export let GlobalMouseDownListener = makePropDecorator('GlobalMouseDownListener', [{'eventName': 'document:mousedown'}, {'args': ['$event']}], HostListener);
export let WindowResizeListener = makePropDecorator('WindowResizeListener', [{'eventName': 'window:resize'}, {'args': ['$event']}], HostListener);
