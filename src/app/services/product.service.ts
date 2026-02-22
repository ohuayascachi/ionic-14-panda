/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Costo, ProductGet, ProductPost } from 'src/model/product.model';
import {
  BehaviorSubject,
  Observable,
  of,
  throwError as observableThrowError,
  throwError,
} from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';

import { FuncionesService } from './funciones.service';
import { PriceGet, PricePost } from 'src/model/precios.model';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

const server = environment.serverDev;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public islogingMsg$: Observable<string>;
  public countDocumentAll$ : Observable<number>;


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
    private router: Router,
    private toastController: ToastController
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
        tap(() => {
          alert.present();
        }),
        tap((x) => loading.dismiss(x)),

        // tap(() => this.router.navigate(['/prices']))
        tap((resp) => console.log(resp)),
        // tap(() => this.getAllProducts()),
        // catchError(this.errorHandler),
        catchError((err) =>
        of(
          this.errorHandler,
          this.presentToast(err.error.message, 'danger', 2000),
          loading.dismiss()
        )
      )
      )
      .subscribe(() => this.getAllProducts());
  }

  /*Esto reemplazara get ALL PRODUCTO
  - si no tiene los precios no se muestra */

  getAllProducts(palabra?: any, cant?: number, page?: number ) {
    let query: any;
    console.log(cant, page);
    query= `text=${palabra||null}&page=${page||2}&limit=${cant||20}`

    if(query.split("undefined&")[1]){
      query = query.split("undefined&")[1]
    }
     else if(query.split("null&")[1] ){
      console.log('FUNCIONA UNDEFINED');
      query = query.split("null&")[1]
    }
  
   
    //Ccambioamos el "return" si algo se afecta
    console.log('QUERY  ',query);
    return this.http
      .get<{ item: ProductGet[]; msg: string; count: number }>(
       // `${server}/products/all?page=1&limit=100`
        `${server}/products/all?${query}`
      )
      .pipe(
        shareReplay(),
        tap((res) => {
        
          this.countDocumentAll$ = of(Number(res.msg));
      
        }),
        map((resp) => resp.item),
       // tap((res) => console.log('servicioo', res)),
        tap((x) => this.subjectPrAll.next(x)), // Muestra todo los products
        map((resp) => resp.filter((x) => x.precios.length > 0)),
        tap((x) => {
          this.subjectProds.next(x);
         // console.log(x);
        })
      );
    //  .subscribe();
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

  //Obtener productos by user ( solo para root y vendedores)

  getProductsByUser(): Observable<ProductGet[]> {
    return this.http
      .get<{ item: ProductGet[]; msg: string; count: number }>(
        `${server}/products/myProducts`,
        this.headers
      )
      .pipe(
        shareReplay(),
        map((resp) => resp.item),
        tap((x) => {
          //console.log(x);
          this.subjectProds.next(x);
        })
        // tap( (x) => {
        //   this.subjectPrAll.next(x);
        // })
      );
    // .subscribe();
  }
  //SE EJECUTAN DENTRO DEL FrontEnd
  getProductId(idProduct: string): Observable<ProductGet[]> {
    return this.subjectProds.pipe(
      map((resp) => resp.filter((x) => x.id === idProduct)),
      tap((x) => (this.dataProdu$ = of(x)))
    );
  }

  getProductIdFromServer(idProduct: string): Observable<ProductGet> {
    return this.http
      .get<{ item: ProductGet; msg: string; count: number }>(
        `${server}/product/${idProduct}`
      )
      .pipe(
        shareReplay(),
        map((resp) => resp.item),
        catchError(this.errorHandler)
      );
  }

  getProductSlugRoute(slugProd: string): Observable<ProductGet[]> {
    // console.log(slugProd);
    return this.subjectPrAll.pipe(
      map((resp) => resp.filter((x) => x.slug === slugProd)),
      //  tap((x) => console.log(x)),
      tap((x) => {
        this.subjectProd.next(x);
      })
      // tap((x) => this.dataProdu$.subscribe(console.log))
    );
  }

  //Solicitud product by slug backed
  getProductSlug(slugProd: string): Observable<ProductGet[] >   {
    return this.http
      .get<{ item: ProductGet; msg: string; count: number }>(
        `${server}/product/slug/${slugProd}`,
        this.headers
      )
      .pipe(
        shareReplay(),
        //  tap((x) => console.log(x)),
        map((resp) => [resp.item]),

        catchError(this.errorHandler)
        // catchError((err) =>
        //   of(
        //     this.errorHandler,
        //     this.presentToast(err.error.message, 'danger', 2000)
        //   )
        // ),
  
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
        tap((x) => console.log('nuemro de eliminados', x.count)),
        tap(() => alert.present()),
        tap((x) => loading.dismiss(x)),
        catchError(this.errorHandler)
      )
      .subscribe();
  }

  async deleteProductById(productID: string) {
    if (!productID) {
      return console.log('No hay ID');
    }

    const alert = await this.fncService.presentAlertWhenDelete();
    // http://localhost:2001/api/product/651995689aceffad47fd7e6f
    this.http
      .delete<{ item: any; msg: string; count: number }>(
        `${server}/product/${productID}`,
        this.headers
      )
      .pipe(
        map((resp) => resp.item),
        tap(() => alert.present()),
        catchError(this.errorHandler)
        //  tap((resp) => this.subjectPric.next(resp))
      )
      .subscribe();
  }

  patchCosto(form: Partial<Costo>) {
    this.http
      .post<{ item: Costo; msg: string; count: number }>(
        `${server}/cost`,
        form,
        this.headers
      )
      .pipe(
        map((resp) => resp.item),

        catchError(this.errorHandler)
        //  tap((resp) => this.subjectPric.next(resp))
      )
      .subscribe();
  }

  //Subir iamgen de producto
  uploadImgProduct(
    idProduct: string,
    file: File,
    lugar: string
  ): Observable<ProductGet> {
    const formData = new FormData();
    formData.append('imgproduct', file);
    formData.append('lugar', lugar);

    return this.http
      .patch<{ item: ProductGet; msg: string; count: number }>(
        `${server}/product/${idProduct}`,
        formData,
        this.headers
      )
      .pipe(
        map((resp) => resp.item)
        // tap((x) => {
        //   this.dataProds$
        //     .pipe(
        //       map((resp) => {
        //         const index = resp.findIndex((z) => z.id === x.id);
        //         resp[index] = x;
        //       })
        //     )
        //     .subscribe();
        // }),
        // catchError(this.errorHandler)
      );
    // .subscribe();
  }

  //DELETE IMAGE
  patchDelteImage(idProduct: string, lugar: string): Observable<ProductGet> {
    return this.http
      .patch<{ item: ProductGet; msg: string; count: number }>(
        `${server}/product/img/${idProduct}`,
        { item: lugar },
        this.headers
      )
      .pipe(
        map((resp) => resp.item)
        // tap((x) => {
        //   this.dataProds$
        //     .pipe(
        //       map((resp) => {
        //         const index = resp.findIndex((z) => z.id === x.id);
        //         resp[index] = x;
        //       })
        //     )
        //     .subscribe();
        // }),
        //catchError(this.errorHandler)
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

// console.log(er);
// this.islogingMsg$ = of(er.error.message);
// alert(er.error.message);

// return of(er.error.message);
