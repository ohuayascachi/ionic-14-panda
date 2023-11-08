import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  map,
  tap,
  catchError,
  shareReplay,
  debounceTime,
  take,
} from 'rxjs/operators';
import { CartGet } from 'src/model/cart.model';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { FuncionesService } from './funciones.service';

const server = environment.serverDev;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private http: HttpClient,
    public toastController: ToastController,
    private alertController: AlertController,
    public svc: FuncionesService
  ) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  postCart(cartForm: { producto: string; count: number; status: boolean }) {
    //cartForm.producto = 'dsdsdfsdfsdfs';
    this.http
      .post<{ item: CartGet; msg: string; count: number }>(
        `${server}/cart`,
        cartForm,
        this.headers
      )
      .pipe(
        //tap((x) => console.log(x)),
        map((resp: { item: CartGet; msg: string; count: number }) => resp.item),
        shareReplay(),
        tap(() =>
          of(this.presentToast('Se ha agregado correctamente', 'success'))
        ),
        catchError((err: HttpErrorResponse) =>
          of(this.presentToast(err.error.message, 'warning'))
        )
      )
      .subscribe();
  }

  //Esta dos funciones se aplicaron en todas . col: color
  async presentToast(mensaje: string, col: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1900,
      position: 'top',
      color: col,
    });
    if (mensaje === 'You are not logged in! Please log in to get access.') {
      this.svc.requiredSigIn();
    }
    await toast.present();
    return;
  }

  errorHandler(er: HttpErrorResponse) {
    // alert(er.error.message);

    return of(er.error.message);
  }
}
