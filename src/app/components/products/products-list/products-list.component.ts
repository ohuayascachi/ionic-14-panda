import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { ProductGet } from 'src/model/product.model';
import { tap, map, debounce, debounceTime } from 'rxjs/operators';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CategoriaGet } from 'src/model/categoria.model';
import { SubcategoriaGet } from 'src/model/subcategoria.model';


@Component({
    selector: 'app-products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss'],
    standalone: false
})
export class ProductsListComponent implements OnInit {
  public products$: Observable<Partial<ProductGet[]>>;
  public categorias$: Observable<CategoriaGet[]>;
  public subcategorias$: Observable<Partial<SubcategoriaGet>[]>;
  //public totalDocs$: Observable<Number>;
  public totalDocs = 20; 
  public numbers:[];
  public items = 0;
  public PAGI = 1;
  public CANTIDAD = 20;
  public numeroPaginas = 1;
  public BTNSiguiente = 'enabled';
  public BTNatras = 'disabled';

  //Variables
  categ: string;

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoriaService: CategoriaService
  ) {    }

  ngOnInit() {
    // console.log(this.CANTIDAD, this.PAGI);
    this.productService.getAllProducts(undefined, this.CANTIDAD, this.PAGI).subscribe();
    this.products$ = this.productService.dataPrAll$
      .pipe(
     // tap((res) => console.log('REST',res)) // Eliminar luego
       );

      //Obetenemos la cantidad de documentos
      this.productService.countDocumentAll$.subscribe( x => {
         this.totalDocs = x;
      });
    
    //this.numbers = Array(5).fill().map((x,i)=>i); // [0,1,2,3,4]

    this.categoriaService.getCategorias().subscribe();
    this.categorias$ = this.categoriaService.dataCateg$.pipe(
      //tap((x) => console.log(1, x)),
      map((resp) => resp.filter((x) => x.cantidadProduc > 0))
      // tap((x) => console.log(2, x))
    );

    this.numeroPaginas = Math.round(this.totalDocs / this.CANTIDAD);

  }

  selectProdByCategoria(e: any) {
    //console.log(e);
    if (!e.target.value) {
      this.products$ = this.productService.dataPrAll$;
      this.subcategorias$ = null;
      return;
    }

    this.categ = e.target.value;
    const cate$ = this.categorias$.pipe(
      map((resp) => resp.find((x) => x.id === e.target.value))
    );

    this.subcategorias$ = cate$.pipe(
      map((resp) => resp.subc),
      map((res: Partial<SubcategoriaGet>[]) =>
        res.filter((x) => x.products.length > 0)
      )
    );
    this.products$ = this.productService.dataPrAll$.pipe(
      map((resp) => resp.filter((x) => x.categoria === e.target.value))
    );
  }

  selectProdBySubCategoria(e: any) {
    if (
      e.target.value === null ||
      e.target.value === undefined ||
      !e.target.value
    ) {
      this.products$ = this.productService.dataPrAll$.pipe(
        map((resp) => resp.filter((x) => x.categoria === this.categ))
      );
      console.log('No hay ID en la pedición');
      return;
    } else {
      const subca$ = this.subcategorias$.pipe(
        map((resp) => resp.filter((x) => x.id === e.target.value)),
        tap((x) => console.log(x))
      );

      subca$.pipe(map((resp) => resp[0])).subscribe((res: SubcategoriaGet) => {
        this.products$ = this.productService.dataPrAll$.pipe(
          map((resp) =>
            resp.filter(
              (x) => x.categoria === res.categoria && x.subcategoria === res.id
            )
          )
        );
      });
    }
  }

  deleteProduct(idProduct: string) {
    // Esto elimina de la BD
    this.productService.deleteProductById(idProduct);

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

  selectCantidad(e: Event) {
    const cant = e.target as HTMLButtonElement;
   // console.log('cant', Number(cant.value));
    this.CANTIDAD = Number(cant.value);
    this.productService.getAllProducts(undefined, this.CANTIDAD, this.PAGI).subscribe();
    this.products$ = this.productService.dataPrAll$;
  }

  pagina(e: Event) {
    const tar = e.target as HTMLButtonElement;
    console.log('tar',tar.textContent);

 
    if (Number(tar.textContent)) {

      this.PAGI = Number(tar.textContent);

      if( Number(tar.textContent) === 1 ){
        this.items = 0;
      }else if ( Number(tar.textContent) === 2  ){
        this.items = 20;
      }else if ( Number(tar.textContent) === 3  ){
        this.items = 40;
      }
 
      //console.log('FIRS',this.PAGI * 1);
       this.BTNatras = 'enabled'
      this.productService.getAllProducts(undefined, this.CANTIDAD, this.PAGI).subscribe();
      this.products$ = this.productService.dataPrAll$;
    }

    if (isNaN(Number(tar.textContent))) {
      //  this.PAGI  = 0;
 
      this.PAGI = tar.textContent === 'Next' ? this.PAGI + 1 : this.PAGI - 1;
      //  console.log(this.CANTIDAD , 'PLISS');

      if (this.PAGI <= 1) {

        console.log('Ultima pagina');
        this.productService.getAllProducts(undefined, this.CANTIDAD, 1).subscribe();
        this.products$ = this.productService.dataPrAll$;
        this.BTNatras = 'disabled'
        return this.PAGI = 1;

      } else {

        //console.log('SUIGIENTE', this.PAGI);

        this.productService.getAllProducts(undefined, this.CANTIDAD, this.PAGI).subscribe();
        this.products$ = this.productService.dataPrAll$;
        this.products$.pipe( tap(resp => {
           
          if(resp.length >= this.CANTIDAD){
            this.BTNSiguiente = 'enabled';
              this.BTNatras = 'enabled'
             console.log('ESTE SE ACTIVA!!!');
          }
          if (resp.length < this.CANTIDAD) {
            this.BTNSiguiente = 'disabled';
          }
        })).subscribe();

      }

    }
  }

  routerRetro() {
    this.router.navigate(['/user']);
  }
}
