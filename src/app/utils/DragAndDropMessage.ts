import { PageCoordinates } from './PageCoordinates';

export class DragAndDropMessage {
  constructor(public coordinates: PageCoordinates, public template: string = undefined) {}
}
