import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductGet } from 'src/model/product.model';
import { ProductService } from '../services/product.service';

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
  ): Observable<ProductGet[]> {
    const prodSlug = route.params.prod;
    // console.log(route);

    // console.log(route.params);
    // console.log(state.root);
    const product$ =
      this.productService.dataProducts$ ||
      this.productService.getProductSlug(prodSlug) ||
      this.productService.getProductSlugRoute(prodSlug);

    //this.productService.dataProdu$.subscribe((x) => console.log(x));
    //console.log(this.prod$.subscribe((x) => console.log(x)));
    // console.log(this.product$.subscribe((x) => console.log(x)));
    // this.productService
    //   .getProductSlug(prodSlug)
    //   .subscribe((x) => console.log('back', x));
    // this.productService
    //   .getProductSlugRoute(prodSlug)
    //   .subscribe((x) => console.log('rote', x));
    // product$.subscribe((x) => console.log('del reolver prod', x));

    return product$;
  }
}
