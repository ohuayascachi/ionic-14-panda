import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductGet } from 'src/model/product.model';
import { ProductService } from '../services/product.service';
import {  HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductResolver implements Resolve<any> {
  public product$: Observable<ProductGet[]>;
  public prod$: Observable<ProductGet[]>;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ProductGet[]| Promise<void> | ((er: HttpErrorResponse) => Observable<any>)> {
    const prodSlug = route.params.prod;
    // console.log(route);

    // console.log(route.params);
    // console.log(state.root);
    const product$ =
      this.productService.dataProducts$ ||
      this.productService.getProductSlug(prodSlug) ||
      this.productService.getProductSlugRoute(prodSlug);

    return product$;
  }
}
