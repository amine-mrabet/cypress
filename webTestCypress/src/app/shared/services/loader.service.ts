import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
/**
 * Singleton Loader Service used to change the state of the loader Subject
 */
@Injectable()
export class LoaderService {
  private loaderSubject = new Subject<boolean>();
  loaderState = this.loaderSubject.asObservable();
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }
  /**
    * Displays the loader
    * @returns {void}
    */
  show() {
    this.loaderSubject.next(true);
    this.isLoading.next(true);
  }
  /**
    * Hides the loader
    * @returns {void}
    */
  hide() {
    this.loaderSubject.next(false);
    this.isLoading.next(true);
  }
}
