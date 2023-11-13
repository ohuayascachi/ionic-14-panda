import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { ProductGet } from 'src/model/product.model';
import { tap, map } from 'rxjs/operators';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CategoriaGet } from 'src/model/categoria.model';
import { SubcategoriaGet } from 'src/model/subcategoria.model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  public products$: Observable<Partial<ProductGet[]>>;
  public categorias$: Observable<CategoriaGet[]>;
  public subcategorias$: Observable<Partial<SubcategoriaGet>[]>;

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit() {
    this.productService.getAllProducts();
    this.products$ = this.productService.dataPrAll$.pipe(
      tap((res) => console.log(res))
    );

    this.categoriaService.getCategorias().subscribe();
    this.categorias$ = this.categoriaService.dataCateg$.pipe(
      //tap((x) => console.log(1, x)),
      map((resp) => resp.filter((x) => x.cantidadProduc > 0))
      // tap((x) => console.log(2, x))
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

    this.products$ = subca$.pipe(
      map((resp) => resp.map((x: any) => x.products)[0])
    );
  }

  deleteProduct(idProduct: string) {
    // Esto elimina de la BD
    //this.productService.deleteProductById(idProduct);

    // esto elimina localmente
    this.products$
      .pipe(
        map((resp) => {
          const index = resp.findIndex((x) => x.id === idProduct);
          resp.splice(index, 1);
          return resp;
        })
      )
      .subscribe();
  }

  routerRetro() {
    this.router.navigate(['/user']);
  }
}
