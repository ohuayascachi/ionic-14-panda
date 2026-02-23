/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { UserGet, UserPost, UserLogin } from 'src/model/user.model';
import { Router } from '@angular/router';
import { map, tap, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { toObservable } from '@angular/core/rxjs-interop';

const server = environment.serverDev;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signals
  private _currentUser = signal<UserGet | null>(null);
  public currentUser = computed(() => this._currentUser());

  // Using signals for derived state
  public isLoggedIn = computed(() => !!this._currentUser() || !!localStorage.getItem('token'));

  // Observables for backward compatibility
  public isLoggedIn$ = toObservable(this.isLoggedIn);
  public isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));

  private _storage: Storage | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: Storage,
    private toastController: ToastController
  ) {
    this.init();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;

    // Attempt to restore user from storage
    const storedUser = await this._storage.get('user');
    if (storedUser) {
      this._currentUser.set(storedUser);
    }
  }

  // Registro auth/signup
  postUser(formUser: UserPost) {
    this.http
      .post<{ status: string; token: string; item: UserGet }>(
        `${server}/auth/signup`,
        formUser
      )
      .pipe(
        catchError((err) => this.handleError(err)),
        tap((resp: any) => {
             if (resp && resp.token) localStorage.setItem('token', resp.token)
        }),
        map((resp: any) => resp.item)
      )
      .subscribe((resp: any) => {
        if(resp){
            this._currentUser.set(resp);
            this._storage?.set('user', resp);
            localStorage.setItem('name', resp.name);
            localStorage.setItem('lastName1', resp.lastName1);
            this.router.navigate(['/products']);
        }
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
          this._currentUser.set(resp.item);
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
          this.handleError(err);
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
      .pipe(
         catchError(err => of(null))
      )
      .subscribe(() => {
        this.doLogoutCleanup();
      });
  }

  doLogoutCleanup() {
    this._currentUser.set(null);
    localStorage.removeItem('lastName1');
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    this._storage?.remove('user');
    this.router.navigate(['/auth/log-in']);
  }

  private handleError(er: HttpErrorResponse) {
    if (er.status === 401 || (er.error && er.error.message === 'jwt expired') || (er.error && er.error.message === 'Token no válido')) {
        this.presentToast('Session expired. Please login again.', 'danger');
        this.doLogoutCleanup();
    }
    return throwError(() => er);
  }

  async presentToast(mensaje: string, col: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1700,
      position: 'top',
      color: col,
    });
    await toast.present();
  }
}
