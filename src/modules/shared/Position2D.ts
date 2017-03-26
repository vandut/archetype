import { PageCoordinates } from './PageCoordinates';
export interface Position2D {
  x: number;
  y: number;
}

export class Position2DHelper {

  public static fromPageCoordinates(coordinates: PageCoordinates): Position2D {
    return {
      x: coordinates.pageX,
      y: coordinates.pageY
    };
  }

}
