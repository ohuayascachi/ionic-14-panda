import { Component, OnChanges, OnInit, ViewChild, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';
import { CustomerGet } from 'src/model/customer.model';
import { ProductService } from 'src/app/services/product.service';
import { ProductGet } from 'src/model/product.model';
import { Observable, Subscription, of } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { LoadingService } from '../shares/loading/loading.service';
import { ListProductsComponent } from './list-products/list-products.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, ListProductsComponent]
})
export class ProductsComponent implements OnInit, OnChanges {
  @ViewChild('popover') popover;
  isOpen = signal(false);
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

    setTimeout(() => {
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
    if (this.popover) {
        this.popover.event = e;
    }
    this.isOpen.set(true);
  }

  changeProductsXUser(e: Event) {
    const target = e.target as HTMLButtonElement;
    this.roleSelect = target.value;
    this.productsService.getAllProducts();
    this.seleccionarProductos(this.roleSelect);
  }

  seleccionarProductos(role: string) {
    this.productsService.dataProds$.subscribe((resp) => {
      this.products = resp;
    });
    this.products.forEach((res) => {
      const valor = res.precios.filter((x: any) => x.toUser === role);
      res.precios = [null];
      res.precios.push(...valor);
    });
    this.prodByRoot$ = of(this.products).pipe(
      map((resp) => resp.filter((x) => x.precios.length > 0))
    );
  }

  filterCategoria(e: string) {
    console.log('todos', e);
    if (e === 'todos') {
      this.products$ = this.productsService.dataProds$;
    } else {
      this.products$ = this.productsService.dataProds$.pipe(
        map((resp) => resp.filter((x) => x.categoria === e))
      );
    }
  }
}
