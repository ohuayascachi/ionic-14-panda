import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, concatMap, finalize, map } from 'rxjs/operators';

@Injectable()
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {
    // console.log('Loading Service created....');
    //this.loading$.subscribe(console.log);
  }

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    //obs$.subscribe((y) => console.log(y));
    return of(null).pipe(
      tap(() => this.loadingOn()),
      concatMap(() => obs$),
      finalize(() => this.loadingOff())
    );
  }

  loadingOn() {
    console.log('ON');
    this.loadingSubject.next(true);
  }

  loadingOff() {
    console.log('OFF');
    this.loadingSubject.next(false);
  }
}
