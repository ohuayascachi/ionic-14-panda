/* eslint-disable @typescript-eslint/member-ordering */
import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  BehaviorSubject,
  Observable,
  Subject,
  of,
  throwError,
} from 'rxjs';
import { UserGet, UserPost, UserLogin } from 'src/model/user.model';
import { Router } from '@angular/router';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
const server = environment.serverDev;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private postsUser: any[] = [];
  private userUpdated = new Subject<any[]>();
  userID = null;

  private subjectUser = new BehaviorSubject<UserGet>(null);
  userDate$: Observable<UserGet> = this.subjectUser.asObservable();

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  islogingMsg$: Observable<string>;

  private _storage: Storage | null = null;
  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: Storage,
    private toastController: ToastController
  ) {
    this.isLoggedIn$ = this.userDate$.pipe(map((user) => !!user)) || this.tok;
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));

    this.init();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get tok(): Observable<boolean> {
    // console.log('xxx', localStorage.getItem('token'));
    const token$ = of(!!localStorage.getItem('token'));
    return token$;
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }
  // Registro auth/signup
  postUser(formUser: UserPost) {
    this.http
      .post<{ status: string; token: string; item: UserGet }>(
        `${server}/auth/signup`,
        formUser
      )
      .pipe(
        catchError(this.errorHandler),
        tap((resp) => localStorage.setItem('token', resp.token)),
        map((resp) => resp.item)
      )
      .subscribe((resp) => {
        this.subjectUser.next(resp);
        this._storage?.set('user', resp);
        localStorage.setItem('name', resp.name);
        localStorage.setItem('lastName1', resp.lastName1);
        this.router.navigate(['/products']);
      });
  }

  // Login
  postLogin(formUser: UserLogin): Observable<any> {
    return this.http
      .post<{
        ok: boolean;
        msg: string;
        item: UserGet;
        token: string;
        status: string;
      }>(`${server}/auth/login`, formUser)
      .pipe(
        tap((resp) => {
          this.subjectUser.next(resp.item);
          if (this._storage) {
            this._storage.set('user', resp.item);
          } else {
            console.warn('Storage not initialized');
          }
        }),
        map((resp) => {
          if (resp) {
            localStorage.setItem('token', resp.token);
            localStorage.setItem('name', resp.item.name);
            localStorage.setItem('lastName1', resp.item.lastName1);
            return resp.item;
          }
        }),
        catchError((err: HttpErrorResponse) => {
          this.presentToast(err.error.message || 'Error en login', 'warning');
          return throwError(() => err);
        })
      );
  }

  //Salir de session
  postLogout() {
    this.http
      .post(
        `${server}/auth/logout`,
        { withCredentials: true },
        { headers: { 'x-token': this.token } }
      )
      .subscribe(() => {
        // console.log(this.token);
        this.subjectUser.next(null);
        localStorage.removeItem('lastName1');
        localStorage.removeItem('name');
        localStorage.removeItem('token');
        this._storage.remove('user');
        this.router.navigate(['/auth/log-in']);
      });
  }

  errorHandler(er: HttpErrorResponse) {
    //this.islogingMsg$ = of(er.error.message);
    // alert(er.error.message);
    return of(er.error.message);
  }
  async presentToast(mensaje: string, col: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1700,
      position: 'top',
      color: col,
    });
    //console.log('mensaje');
    await toast.present();
  }
}
