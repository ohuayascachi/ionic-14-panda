import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { ProductGet } from 'src/model/product.model';
import { elementAt, map, shareReplay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.scss'],
})
export class PreciosComponent implements OnInit {
  public productsAllWithPrecio$: Observable<ProductGet[]>;
  public productsAllWithoutPrecio$: Observable<ProductGet[]>;

  seletedSegment = 'none'; // none something
  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.productService.getAllProducts();
    this.productsAllWithPrecio$ = this.productService.dataPrAll$.pipe(
      // tap((x) => console.log('COM PRECIO', x)),
      map((resp) => resp.filter((x) => x.precios.length > 0))
    );

    this.productsAllWithoutPrecio$ = this.productService.dataPrAll$.pipe(
      // tap((x) => console.log('SIN PRECIO', x)),
      map((resp) => resp.filter((x) => x.precios.length === 0))
    );
  }

  segmentChange(event: CustomEvent) {
    this.seletedSegment = event.detail.value;
  }

  deletePrice(idProduct: string) {
    let result: any;

    this.productService.deletePricingsByIpProducts(idProduct);

    //qUISTA DE LA LISTA CON PRECIOS
    this.productsAllWithPrecio$
      .pipe(
        map((resp) => {
          const index = resp.findIndex((x) => x.id === idProduct);
          result = resp.splice(index, 1);

          return resp;
        })
      )
      .subscribe((x) => {
        this.productsAllWithPrecio$ = of(x);
      });

    // agrega a la lISTA SIN PRECIOS
    this.productsAllWithoutPrecio$.subscribe((x) => {
      const xxx = x.splice(x.length, 1, result[0]);
      this.productsAllWithoutPrecio$ = of(x);
    });
  }
  routerRetro() {
    this.router.navigate(['/user']);
  }
}
