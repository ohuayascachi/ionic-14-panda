import { Component, OnInit } from '@angular/core';
import { Observable, fromEvent, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CategoriaService } from 'src/app/services/categoria.service';
import { FuncionesService } from 'src/app/services/funciones.service';
import { ProductService } from 'src/app/services/product.service';
import { CategoriaGet } from 'src/model/categoria.model';
import { ProductGet } from 'src/model/product.model';
import { SubcategoriaGet } from 'src/model/subcategoria.model';

@Component({
    selector: 'app-cost',
    templateUrl: './cost.component.html',
    styleUrls: ['./cost.component.scss'],
    standalone: false
})
export class CostComponent implements OnInit {
  public categorias$: Observable<CategoriaGet[]>;
  public subcategorias$: Observable<Partial<SubcategoriaGet>[]>;
  public productos$: Observable<Partial<ProductGet>[]>;

  // Varbialnes
  public arrProd = [];
  public categoria: CategoriaGet;
  constructor(
    public funcionesService: FuncionesService,
    private categoriaService: CategoriaService,
    private productService: ProductService
  ) {}
  ngOnInit() {
    //Get all products
    this.productService.getAllProducts();
    this.productos$ = this.productService.dataPrAll$;

    //GET ALL CATEGORIAS
    this.categoriaService.getCategorias().subscribe();
    this.categorias$ = this.categoriaService.dataCateg$.pipe(
      //tap((x) => console.log(1, x)),
      map((resp) => resp.filter((x) => x.cantidadProduc > 0))
    );
    setTimeout(() => {
      this.productos$.pipe(tap((x) => console.log(x))).subscribe();
    }, 100);

    //document.getElementById()
  }

  selectProdByCategoria(e: any) {
    // console.log(e.target.value);
    if (!e.target.value) {
      console.log('No hay ID en la pedición');
      return;
    }

    this.productos$ = this.productService.dataPrAll$.pipe(
      map((resp) => resp.filter((x) => x.categoria === e.target.value))
      // map((resp) => resp.map( x => x.costo[0].cost.map( t => t) ))
    );

    const cate$ = this.categorias$.pipe(
      map((resp) => resp.find((x) => x.id === e.target.value)),
      tap((x) => (this.categoria = x))
      // tap((x) => {
      //   console.log(x.products);

      //   this.productos$.pipe(map(() => x.products));
      //   this.productos$.subscribe((y) => console.log(y));
      // })
    );

    this.subcategorias$ = cate$.pipe(
      map((resp) => resp.subc),
      map((res: Partial<SubcategoriaGet>[]) =>
        res.filter((x) => x.products.length > 0)
      )
      // tap((x) => {
      //   this.productos$ = of(x[0].products);
      //   console.log(x[0]);
      // })
    );
  }

  selectProdBySubCategoria(e: any) {
    //const target = e.target as HTMLButtonElement;
    console.log('sub', e.target.value);
    const subca$ = this.subcategorias$.pipe(
      map((resp) => resp.filter((x) => x.id === e.target.value))
    );

    console.log('cat', this.categoria.id);
    // this.productos$ = subca$.pipe(
    //   map((resp) => resp.map((x: any) => x.products)[0])
    // );

    this.productos$ = this.productService.dataPrAll$.pipe(
      map((resp) =>
        resp.filter(
          (x) =>
            x.categoria === this.categoria.id &&
            x.subcategoria === e.target.value
        )
      )
    );
  }

  selectProduct(e: Event) {
    const target = e.target as HTMLButtonElement;
    console.log(target.value);
    this.productos$ = this.productos$.pipe(
      map((resp) => resp.filter((x) => x.id === target.value))
    );
  }

  sentPrecio(idProduc, e) {
    const idIn = 'cost-' + e;
    const valor = document.getElementById(idIn) as HTMLInputElement | null;
    console.log(idProduc, Number(valor.value));

    this.productos$
      .pipe(
        tap((resp) => {
          const result = resp.filter((res) => res.id === idProduc);
          if (result) {
            const formD = { costo: Number(valor.value), product: idProduc };
            this.productService.patchCosto(formD);
          }
          if (result[0].cost.length > 0) {
            result[0].cost[0].costo = Number(valor.value);
            // aqui mandamos a la BD
          } else if (result[0].cost.length <= 0) {
            result[0].cost.push({
              costo: Number(valor.value),
              product: idProduc,
              fecha: new Date(),
              nota: 'ok',
            });

            //aqui se va a la BD
          }
          console.log(result[0].cost[0].costo);
        })
      )
      .subscribe();
  }
}
