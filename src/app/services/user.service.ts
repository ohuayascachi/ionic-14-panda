/* eslint-disable @typescript-eslint/member-ordering */

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError, delay } from 'rxjs/operators';
import { UserGet, UserPost } from 'src/model/user.model';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FuncionesService } from './funciones.service';

const server = environment.serverDev;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private subject = new BehaviorSubject<any>(null);
  tabToTab4$: Observable<any> = this.subject.asObservable();

  private subjectUser = new BehaviorSubject<UserGet>(null);

  dataUser$: Observable<UserGet> = this.subjectUser.asObservable();

  constructor(    private fncService: FuncionesService,
                  private http: HttpClient,    private router: Router,     private toastController: ToastController) {}
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
        tap((x) => this.subjectUser.next(x.item)),
        // tap((x) => console.log(x)),
         catchError(this.errorHandler),
      )
      .subscribe();
  }

  async patchUser(form: UserPost){
    if (!form) {
      console.log('no hay nada');
      return;
    }
    const loading = await this.fncService.showLoading(); //Esto se muestra para indicar q esta cargando
    await loading.present();
    const alert = await this.fncService.presentAlertUser(); //Respuesta del servidor
    this.http
    .patch<{ item: UserGet; msg: string; }>(
      `${server}/user/updateMe`,
      form,
      this.headers
    )
    .pipe(
      tap(() => {
        alert.present();
      }),
      tap((x) => loading.dismiss(x)),
      tap((x) => this.subjectUser.next(x.item)),
      // delay( 500),
      // tap( ()=> this.router.navigate(['/user'])),
      catchError((err) =>
      of(
        this.errorHandler,
        this.presentToast(err.error.message, 'danger', 1500),
        loading.dismiss()
      )
    )
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

    //Esta dos funciones se aplicaron en todas . col: color
    async presentToast(mensaje: string, col: string, tiempo?: number) {
      const toast = await this.toastController.create({
        message: mensaje,
        duration: tiempo | 1200,
        position: 'top',
        color: col,
      });

      await toast.present();
    }
}
