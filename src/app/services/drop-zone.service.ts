import { Injectable } from '@angular/core';
import { PageCoordinates } from '../utils/PageCoordinates';

export interface DropZone {
  onDropZoneActivated(source: HTMLElement, coordinates: PageCoordinates);
  isInDropZone(coordinates: PageCoordinates): boolean;
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

  public findDropZone(coordinates: PageCoordinates): DropZone {
    return this.dropZones.find(dz => dz.isInDropZone(coordinates));
  }

}
