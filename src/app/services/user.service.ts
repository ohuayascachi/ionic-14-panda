/* eslint-disable @typescript-eslint/member-ordering */

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { UserGet, UserPost } from 'src/model/user.model';

const server = environment.serverDev;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private subject = new BehaviorSubject<any>(null);
  tabToTab4$: Observable<any> = this.subject.asObservable();

  private subjectUser = new BehaviorSubject<UserGet>(null);

  dataUser$: Observable<UserGet> = this.subjectUser.asObservable();

  constructor(private http: HttpClient) {}
  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get headers() {
    return { headers: { 'x-token': this.token } };
  }
  getUserByID(idUser: string) {
    this.http
      .get<{ item: UserGet; msg: string; count: number }>(
        `${server}/user/${idUser}`,
        this.headers
      )
      .pipe(
        catchError(this.errorHandler),
        tap((x) => this.subjectUser.next(x.item))
        // tap((x) => console.log(x))
      )
      .subscribe();
  }
  getUser() {
    this.http
      .get<{ item: UserGet; msg: string; count: number }>(
        `${server}/myuser`,
        this.headers
      )
      .pipe(
        catchError(this.errorHandler),
        tap((x) => this.subjectUser.next(x.item))
        //  tap((x) => console.log(x))
      )
      .subscribe();
  }
  //  To pass date

  tabsToPag4() {
    this.subject.next(null);
  }

  errorHandler(er: HttpErrorResponse) {
    // console.log(er);
    // this.islogingMsg$ = of(er.error.message);
    alert(er.error.message);
    return of(er.error.message);
  }
}
