/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { BehaviorSubject, Observable, Subject, of, timer } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  tap,
  timeout,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CartGet } from 'src/model/cart.model';
import { OrderPost, OrderGet } from 'src/model/order.model';

const server = environment.serverDev;

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // private orders: OrderGet[] = [];
  private subjectOrder = new BehaviorSubject<number>(null);

  private subjcCart = new BehaviorSubject<CartGet[]>(null);
  private subjecSubto = new BehaviorSubject<{
    _id: string;
    total: number;
    count: number;
  }>(null);
  private subjectOrders = new BehaviorSubject<OrderGet[]>(null);
  private data: any = null;
  private dataUpdated = new Subject<OrderGet[]>();

  public cantOrder$: Observable<number> = this.subjectOrder.asObservable();

  public dataCart$: Observable<CartGet[]> = this.subjcCart.asObservable();
  public dataSubtotal$: Observable<{
    _id: string;
    total: number;
    count: number;
  }> = this.subjecSubto.asObservable();
  public dataOrders$: Observable<OrderGet[]> =
    this.subjectOrders.asObservable();

  constructor(
    private http: HttpClient,
    public toastController: ToastController,
    private router: Router
  ) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  postOrderProduct(post: OrderPost) {
    this.http
      .post<{ ok: boolean; item: OrderGet }>(`${server}/order`, post)
      .subscribe((respData) => console.log('respData:', respData));
  }

  // Obeter order by use listener
  getOrderUpdateListener() {
    // return this.ordersUpdated.asObservable();
  }

  //Obtiene la orden completa
  getOrderUpdatedCompletedListener() {
    return this.dataUpdated.asObservable();
  }

  updateOrderOfProduct(idOrder: string, formOrder: any) {
    return this.http.put<{ ok: boolean; msg: string; item: any }>(
      ` ${server}/order/ord/${idOrder}`,
      formOrder
    );
  }

  //Es necesario actualizar
  postOrder(form: Partial<OrderPost>) {
    this.http
      .post<{ item: OrderGet; msg: string; count: number }>(
        `${server}/order`,
        form,
        this.headers
      )
      .pipe(
        // tap((x) => console.log(x)),
        catchError((err: HttpErrorResponse) =>
          of(this.presentToast(err.error.message, 'warning'))
        ),
        // shareReplay(),
        map(
          (resp: { item: OrderGet; msg: string; count: number }) => resp.item
        ),
        tap(() => {
          this.router.navigate(['orders-list']);
        }),
        tap(() => this.presentToast('Se agregado correctamente', 'success'))
      )
      .subscribe();
  }

  //Conseguir todas las ordenes
  getOrdersByUser() {
    // http://localhost:2001/api/orderByUser

    this.http
      .get<{ item: OrderGet[]; msg: string; count: number }>(
        `${server}/orderByUser`,
        this.headers
      )
      .pipe(
        catchError(this.errorHandler), //this.subjecSubto.next(resp[0])
        map((resp) => resp.item),
        tap((resp) => this.subjectOrders.next(resp))
      )
      .subscribe();
  }

  // patch to replace count and pricing
  updatedCantidad(data: any) {
    //  console.log(data);
    const document = { producto: data.product, count: data.count };
    this.http
      .patch<{ item: CartGet; msg: string; count: number }>(
        `${server}/cart/${data.cart}`,
        document,
        this.headers
      )
      .pipe(
        catchError(this.errorHandler),
        map((resp) => resp.item),
        debounceTime(700),
        distinctUntilChanged(),
        tap((resp: CartGet) => {
          this.dataCart$
            .pipe(
              // tap((x) => console.log(x)),
              map((res) => {
                const index = res.findIndex((re) => re.id === data.cart);
                //console.log(index);
                res[index].precioSelect = resp.precioSelect;
                res[index].count = resp.count;
              })
            )
            .subscribe();
        }),
        tap(() => this.getOnlyTotalPricing()),
        shareReplay()
      )
      .subscribe();
  }

  getOnlyTotalPricing() {
    this.http
      .get<{ item: CartGet; msg: any; count: number }>(
        `${server}/cart`,
        this.headers
      )
      .pipe(
        catchError(this.errorHandler), //this.subjecSubto.next(resp[0])
        tap((resp) => this.subjecSubto.next(resp.msg[0]))
      )
      .subscribe();
  }
  conseguirCarritoByUser() {
    this.http
      .get<{ item: CartGet; msg: any; count: number }>(
        `${server}/cart`,
        this.headers
      )
      .pipe(
        timeout(500),
        // tap((resp) => console.log(resp)),
        catchError(this.errorHandler), //this.subjecSubto.next(resp[0])
        tap((resp) => this.subjecSubto.next(resp.msg[0])),
        map((resp) => resp.item),
        //tap((resp) => console.log(resp)),

        tap((resp) => this.subjcCart.next(resp))
      )
      .subscribe();
  }

  getAllOrdersForRoot() {
    this.http
      .get<{ item: OrderGet[]; msg: string; count: number }>(
        `${server}/order/all`,
        this.headers
      )
      .pipe(
        catchError(this.errorHandler), //this.subjecSubto.next(resp[0])
        map((resp) => resp.item),
        //  tap((z) => console.log(z)),
        tap((resp) => this.subjectOrders.next(resp))
      )
      .subscribe();
  }

  //Elimina el cart of la Order
  eliminarCart(idCart: string) {
    this.http
      .delete<{ doc: CartGet; msg: string; count: number }>(
        `${server}/cart/${idCart}`,
        this.headers
      )
      .pipe(
        catchError(this.errorHandler),
        map((resp) => resp.doc),
        tap(() => {
          this.dataCart$
            .pipe(
              map((res) => {
                const index = res.findIndex((re) => re.id === idCart);
                const arr = res.splice(index, 1);
                return arr;
              }),
              tap(() => this.getOnlyTotalPricing())
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  updatedOrderForRoot(id: string, data: { statusOrder: string }) {
    this.http
      .patch<{ item: OrderGet; msg: string; count: number }>(
        `${server}/order/${id}`,
        data,
        this.headers
      )
      .pipe(
        catchError(this.errorHandler),
        map((resp) => resp.item),
        tap(() => {
          this.dataOrders$
            .pipe(
              map((x) => {
                const result = x.find((y) => y.id === id);
                result.statusOrder = data.statusOrder;
              })
            )
            .subscribe();
        })
        // tap((x) => console.log(x))
        //tap((resp) => this.subjectOrders.next(resp))
      )
      .subscribe();
  }
  errorHandler(er: HttpErrorResponse) {
    // console.log(er);
    // this.islogingMsg$ = of(er.error.message);
    alert(er.error.message);
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
