/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductGet, ProductPost } from 'src/model/product.model';
import {
  BehaviorSubject,
  Observable,
  of,
  throwError as observableThrowError,
} from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';

import { FuncionesService } from './funciones.service';
import { PriceGet, PricePost } from 'src/model/precios.model';
import { Router } from '@angular/router';

const server = environment.serverDev;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public islogingMsg$: Observable<string>;

  private subjectPrAll = new BehaviorSubject<ProductGet[]>([]);
  private subjectProds = new BehaviorSubject<ProductGet[]>([]); // Aqui solo viene los productos filtrados con precios
  private subjectProd = new BehaviorSubject<ProductGet[]>([]);
  private subjectPric = new BehaviorSubject<PriceGet[]>([]);

  public dataProds$: Observable<ProductGet[]> =
    this.subjectProds.asObservable();
  public dataProdu$: Observable<ProductGet[]> = this.subjectProd.asObservable();
  public dataPrAll$: Observable<ProductGet[]> =
    this.subjectPrAll.asObservable();
  public dataProducts$: Observable<ProductGet[]>;
  public dataPrice$: Observable<PriceGet[]> = this.subjectPric.asObservable();

  constructor(
    private http: HttpClient,
    private fncService: FuncionesService,
    private router: Router
  ) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  async postProducto(formProduct: ProductPost) {
    const loading = await this.fncService.showLoading();
    await loading.present();
    const alert = await this.fncService.presentAlert();

    return this.http
      .post<{ item: ProductGet; msg: string; count: number }>(
        `${server}/product`,
        formProduct,
        this.headers
      )
      .pipe(
        catchError(this.errorHandler),
        //tap((x) => console.log('1', x)),
        tap(() => {
          alert.present();
        }),

        map((resp) => resp.item),
        tap((x) => loading.dismiss(x))
      )
      .subscribe();
  }

  async postPrecios(formPrices: PricePost) {
    if (!formPrices) {
      console.log('no hay nada');
      return;
    }
    const loading = await this.fncService.showLoading(); //Esto se muestra para indicar q esta cargando
    await loading.present();
    const alert = await this.fncService.presentAlert(); //Respuesta del servidor

    this.http
      .post<{ item: PriceGet[]; msg: string; count: number }>(
        `${server}/precios/many`,
        formPrices,
        this.headers
      )
      .pipe(
        catchError(this.errorHandler),
        tap(() => {
          alert.present();
        }),
        tap((x) => loading.dismiss(x)) // De esta manera se termina el alert
        // tap(() => this.router.navigate(['/prices']))
        //  tap((resp) => console.log(resp.item))
      )
      .subscribe(() => {
        this.getAllProducts();
      });
  }

  /*Esto reemplazara get ALL PRODUCTO
  - si no tiene los precios no se muestra */

  getAllProducts() {
    this.http
      .get<{ item: ProductGet[]; msg: string; count: number }>(
        `${server}/products/all`,
        this.headers
      )
      .pipe(
        shareReplay(),

        map((resp) => resp.item),
        //  tap((res) => console.log('servicoo', res)),
        tap((x) => this.subjectPrAll.next(x)), // Muestra todo los products
        map((resp) => resp.filter((x) => x.precios.length > 0)),
        tap((x) => {
          this.subjectProds.next(x);
          // console.log(x);
        })
      )
      .subscribe();
  }

  getPriciosByProductID(productID: string) {
    this.http
      .get<{ item: PriceGet[]; msg: string; count: number }>(
        `${server}/precios/byproduct/${productID}`,
        this.headers
      )
      .pipe(
        map((resp) => resp.item),
        tap((resp) => this.subjectPric.next(resp))
      )
      .subscribe();
  }

  //SE EJECUTAN DENTRO DEL FrontEnd
  getProductId(idProduct: string): Observable<ProductGet[]> {
    return this.subjectProds.pipe(
      map((resp) => resp.filter((x) => x.id === idProduct)),
      tap((x) => (this.dataProdu$ = of(x)))
    );
  }

  getProductSlugRoute(slugProd: string): Observable<ProductGet[]> {
    // console.log(slugProd);
    return this.subjectPrAll.pipe(
      map((resp) => resp.filter((x) => x.slug === slugProd)),
      tap((x) => {
        this.subjectProd.next(x);
      })
      // tap((x) => this.dataProdu$.subscribe(console.log))
    );
  }

  //Solicitud par ael backed
  getProductSlug(slugProd: string): Observable<ProductGet[]> {
    return this.http
      .get<{ item: ProductGet; msg: string; count: number }>(
        `${server}/product/slug/${slugProd}`,
        this.headers
      )
      .pipe(
        catchError(this.errorHandler),
        shareReplay(),
        map((resp) => [resp.item])
      );
  }

  recivedData(data: ProductGet[]): Observable<ProductGet[]> {
    this.dataProducts$ = of(data);
    return of(data);
  }

  async deletePricingsByIpProducts(productId: string) {
    const loading = await this.fncService.showLoading();
    await loading.present();
    const alert = await this.fncService.presentAlertWhenDelete(); //Respuesta del servidor

    this.http
      .delete<{ item: any; msn: string; count: number }>(
        `${server}/precios/many/${productId}`,
        this.headers
      )
      .pipe(
        catchError(this.errorHandler),
        tap((x) => console.log('nuemro de eliminados', x.count)),
        tap(() => alert.present()),
        tap((x) => loading.dismiss(x))
      )
      .subscribe();
  }
  errorHandler(er: HttpErrorResponse) {
    // console.log(er);
    // this.islogingMsg$ = of(er.error.message);
    alert(er.error.message);
    return of(er.error.message);
  }
}
