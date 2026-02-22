import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProductService } from 'src/app/services/product.service';
import { CategoriaGet } from 'src/model/categoria.model';
import { PriceGet } from 'src/model/precios.model';
import { ProductGet } from 'src/model/product.model';
import { SubcategoriaGet } from 'src/model/subcategoria.model';

@Component({
    selector: 'app-precio-list',
    templateUrl: './precio-list.component.html',
    styleUrls: ['./precio-list.component.scss'],
    standalone: false
})
export class PrecioListComponent implements OnInit {
  //Observables
  public productsAllWithPrecio$: Observable<ProductGet[]>;
  public productsFilms$: Observable<ProductGet[]>;
  public productsCinta$: Observable<ProductGet[]>;
  public productsOtros$: Observable<ProductGet[]>;

  public categorias$: Observable<CategoriaGet[]>;
  public subcategorias$: Observable<Partial<SubcategoriaGet>[]>;
  public productos$: Observable<Partial<ProductGet>[]>;
  public precios$: Observable<PriceGet[]>;

  public preciosGeneral$: Observable<PriceGet[]>;
  public preciosSeller1$: Observable<PriceGet[]>;
  public preciosSeller2$: Observable<PriceGet[]>;
  public preciosSeller3$: Observable<PriceGet[]>;
  public preciosSeller4$: Observable<PriceGet[]>;
  public preciosSeller5$: Observable<PriceGet[]>;

  constructor(
    private productService: ProductService,
    private router: Router,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit() {
    //GET ALL CATEGORIAS
    this.categoriaService.getCategorias().subscribe();
    this.categorias$ = this.categoriaService.dataCateg$.pipe(
      //tap((x) => console.log(1, x)),
      map((resp) => resp.filter((x) => x.cantidadProduc > 0))
      // tap((x) => console.log(2, x))
    );

    this.productService.getAllProducts();
    this.productsAllWithPrecio$ = this.productService.dataPrAll$.pipe(
      map((resp) => resp.filter((x) => x.precios.length > 0))
      // tap((x) => console.log('COM PRECIO', x))
    );

    this.productsFilms$ = this.productService.dataPrAll$.pipe(
      map((resp) => resp.filter((x) => x.categoria === ''))
    );
  }

  selectProdByCategoria(e: any) {
    //console.log(e);
    if (!e.target.value) {
      console.log('No hay ID en la pedición');
      return;
    }

    const cate$ = this.categorias$.pipe(
      map((resp) => resp.find((x) => x.id === e.target.value))
    );

    this.subcategorias$ = cate$.pipe(
      map((resp) => resp.subc),
      map((res: Partial<SubcategoriaGet>[]) =>
        res.filter((x) => x.products.length > 0)
      )
    );
  }

  selectProdBySubCategoria(e: any) {
    const subca$ = this.subcategorias$.pipe(
      map((resp) => resp.filter((x) => x.id === e.target.value))
    );

    this.productos$ = subca$.pipe(
      map((resp) => resp.map((x: any) => x.products)[0])
    );
  }

  selectProduct(e: any) {
    // console.log(e.target.value);
    this.productService.getPriciosByProductID(e.target.value);
    const precios$ = this.productService.dataPrice$;
    // precios$.subscribe((x) => console.log(x));
    this.preciosGeneral$ = precios$.pipe(
      map((resp) => resp.filter((x) => x.toUser === 'general'))
    );
    this.preciosSeller1$ = precios$.pipe(
      map((resp) => resp.filter((x) => x.toUser === 'seller-1'))
    );
    this.preciosSeller2$ = precios$.pipe(
      map((resp) => resp.filter((x) => x.toUser === 'seller-2'))
    );
    this.preciosSeller3$ = precios$.pipe(
      map((resp) => resp.filter((x) => x.toUser === 'seller-3'))
    );
    this.preciosSeller4$ = precios$.pipe(
      map((resp) => resp.filter((x) => x.toUser === 'seller-4'))
    );
    this.preciosSeller5$ = precios$.pipe(
      map((resp) => resp.filter((x) => x.toUser === 'seller-5'))
    );
  }
  routerRetro() {
    this.router.navigate(['/user']);
  }
}
