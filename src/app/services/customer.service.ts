import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CustomerGet, CustomerPost } from 'src/model/customer.model';

import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ToastController } from '@ionic/angular';

const server = environment.serverDev;

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private subjectClientbyUser = new BehaviorSubject<CustomerGet[]>([]);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public dataClientByUser$: Observable<CustomerGet[]> =
    this.subjectClientbyUser.asObservable();

  constructor(
    private http: HttpClient,
    public toastController: ToastController
  ) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  // Para ver si el usuario existe
  getCustomerNumber(phone: string) {
    return this.http.get<{ item: CustomerGet; msg: string }>(
      `${server}/client/${phone}`
    );
  }

  // Post new customer
  postCustomer(formCustomer: CustomerPost) {
    return this.http
      .post<{ item: CustomerGet; msg: string; count: number }>(
        `${server}/client`,
        formCustomer,
        this.headers
      )
      .pipe(catchError((err) =>
      of(
        this.errorHandler,
        this.presentToast(err.error.message, 'danger', 3500)
      )));
  }

  getCustomersByUser(): Observable<CustomerGet[]> {
    return this.http
      .get<{ item: CustomerGet[]; msg: string; count: number }>(
        `${server}/clientByUser`,
        this.headers
      )
      .pipe(
        //tap((resp) => console.log(resp)),
        map((resp) => resp.item),
        tap((resp) => this.subjectClientbyUser.next(resp))
      );
  }

  delteCustomer(iCustomer: string) {
    return this.http
      .delete<{ item: CustomerGet; msg: string; count: number }>(
        `${server}/client/${iCustomer}`,
        this.headers
      )
      .pipe(
        tap((x) => {
          this.presentToast('Se eliminado correctamente', 'danger');
        }),
        catchError((err) =>
          of(
            this.errorHandler,
            this.presentToast(err.error.message, 'danger', 3500)
          )
        )
      );
  }

  patchCustomer(idCus: string, formUpdated: Partial<CustomerGet>) {
   return this.http
      .patch<{ item: CustomerGet; msg: string; count: number }>(
        `${server}/client/${idCus}`,
        formUpdated,
        this.headers
      )
      .pipe(
       // tap((resp) => console.log(resp)),
        tap((resp) => {
           this.dataClientByUser$
            .pipe(map((x) => {
              const index = x.findIndex((y) => y.id === resp.item.id);
              x.splice( index, 1, resp.item);
              console.log(x);
              this.subjectClientbyUser.next(x);
           
              }));
            // .subscribe( );
          //console.log(clientes); // Esto es un observableconst clientes =
         
        }),
        catchError((err) =>
          of(
            this.errorHandler,
            this.presentToast(err.error.message, 'danger', 2000)
          )
        )
      );
  }

  //Manejo de error
  errorHandler(er: HttpErrorResponse) {
    //return;
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
