import { Injectable } from '@angular/core';
import { DraggableItem } from './DraggableItem';
import { Position2D } from '../shared/Position2D';

export interface DropZone {
  onDropZoneActivated(sourceItem: DraggableItem, position: Position2D);
  isInDropZone(label: string, position: Position2D): boolean;
}

@Injectable()
export class DropZoneService {

  private dropZones: DropZone[] = [];

  public addDropZone(dz: DropZone) {
    this.dropZones.push(dz);
  }

  public removeDropZone(dz: DropZone) {
    const index = this.dropZones.indexOf(dz);
    if (index > -1) {
      this.dropZones.splice(index, 1);
    }
  }

  public findDropZone(label: string, position: Position2D): DropZone {
    return this.dropZones.find(dz => dz.isInDropZone(label, position));
  }

}
