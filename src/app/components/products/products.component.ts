/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnChanges, OnInit, ViewChild, Input } from '@angular/core';

import { map } from 'rxjs/operators';

import { CustomerGet } from 'src/model/customer.model';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ProductGet } from 'src/model/product.model';
import { Observable, Subscription, of } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { PriceGet } from 'src/model/precios.model';
import { LoadingService } from '../shares/loading/loading.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    standalone: false
})
export class ProductsComponent implements OnInit, OnChanges {
  @ViewChild('popover') popover;
  isOpen = false;
  @Input() busqueda: string;

  products: ProductGet[] = [];
  public products$: Observable<ProductGet[]>;
  public prodByRoot$: Observable<ProductGet[]>;
  public productsSub: Subscription;

  timeBusqueda = false;
  public customer: CustomerGet;
  public addresSelected;
  messegeFormNumber = '';
  userRole$: Observable<string> = of('general');
  roleSelect = 'general';

  constructor(
    private store: Storage,
    private productsService: ProductService,
    private loadingService: LoadingService
  ) {}

  ngOnChanges() {
    const prods$ = this.productsService.getAllProducts(this.busqueda, 10, 1);
    this.products$ =
      this.loadingService.showLoaderUntilCompleted<ProductGet[]>(prods$);
  }

  async ngOnInit() {
    const prods$ = this.productsService.getAllProducts(null, 50, 1);
    this.products$ =
      this.loadingService.showLoaderUntilCompleted<ProductGet[]>(prods$);

    //this.products$ = this.productsService.dataProds$;

    setTimeout(() => {
      // console.log('ngOnInit tiempo');
      this.store.get('user').then((resp) => {
        if (resp == null || undefined) {
          return;
        } else {
          this.userRole$ = of(resp.role);
        }
      });
    }, 150);
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    //  console.log(e);
    this.isOpen = true;
  }

  changeProductsXUser(e: Event) {
    const target = e.target as HTMLButtonElement;
    this.roleSelect = target.value;
    this.productsService.getAllProducts();
    //console.log(this.roleSelect);
    this.seleccionarProductos(this.roleSelect);
  }

  seleccionarProductos(role: string) {
    this.productsService.dataProds$.subscribe((resp) => {
      this.products = resp;
    });
    // console.log(this.products);
    this.products.forEach((res) => {
      // console.log('antes', res);
      const valor = res.precios.filter((x: any) => x.toUser === role);
      res.precios = [null];
      res.precios.push(...valor);
    });
    this.prodByRoot$ = of(this.products).pipe(
      map((resp) => resp.filter((x) => x.precios.length > 0))
      //  tap((x) => console.log('desdepues', x))
    );
    // });
  }

  filterCategoria(e: string) {
    console.log('todos', e);

    //this.productsService.getAllProducts();
    if (e === 'todos') {
      this.products$ = this.productsService.dataProds$;
    } else {
      this.products$ = this.productsService.dataProds$.pipe(
        map((resp) => resp.filter((x) => x.categoria === e))
      );
    }
  }
}

// agregarUser(numerUser: string) {
//   const numeroCel = numerUser.replace(/ /g, '');
//   this.router.navigate(['/customer', numeroCel]);
// }
// this.formClient = this.fb.group({
//   phone: [
//     '',
//     [
//       Validators.maxLength(11),
//       Validators.minLength(11),
//       Validators.required,
//     ],
//   ],
// });
// this.formClient
//   .get('phone')
//   .valueChanges.pipe(distinctUntilChanged(), debounceTime(1000))
//   .subscribe((val) => {
//     console.log('cambio un valor' + val, val.length); // Lineas abajo se ejecuta si es valido el form
//     const numeroCel = val.replace(/ /g, '');
//     console.log(this.customer);
//     if (numeroCel.length === 9 && this.formClient.get('phone').dirty) {
//       this.messegeFormNumber = '';

//       // Simulamos que tomara un tiempo de busqueda en BD 2Seg
//       this.customerService
//         .getCustomerNumber(numeroCel)
//         .subscribe((respData) => {
//           this.timeBusqueda = false;
//           if (respData.ok === false) {
//             this.classInputNumber1 = false;
//             this.classInputNumber2 = true;
//           } else {
//             this.classInputNumber1 = true;
//             this.classInputNumber2 = false;
//             this.customer = respData.item;
//           }
//         });

//       this.timeBusqueda = true;
//       this.classInputNumber2 = false;
//       this.classInputNumber1 = false;
//       // };
//     } else {
//       this.classInputNumber2 = false;
//       this.classInputNumber1 = false;

//       this.messegeFormNumber = 'Número no valido';
//     }
//   });

// formClient: FormGroup;
// public classInputNumber1 = false;
// public classInputNumber2 = false;
