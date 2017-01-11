import * as Rx from 'rxjs/Rx';

export class Topic<T> {
    
  private subject = new Rx.Subject<T>();

  emit(value: T) {
    this.subject.next(value);
  }

  subscribe(next?: (value: T) => void): Rx.Subscription {
    return this.subject.subscribe(next);
  }

}
