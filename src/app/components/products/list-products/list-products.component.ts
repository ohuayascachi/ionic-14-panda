import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProductService } from 'src/app/services/product.service';
import { CategoriaGet } from 'src/model/categoria.model';
import { ProductGet } from 'src/model/product.model';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit, OnChanges {
  @Input() productsList: ProductGet[] = [];

  @Output() filterByCategoria = new EventEmitter<string>();

  //Variable obs
  public categorias$: Observable<CategoriaGet[]>;
  public products$: Observable<Partial<ProductGet[]>>;

  products: ProductGet[] = [];

  public PAGI = 1;
  public CANTIDAD = 100;
  public BTNSiguiente = 'enabled';
  public BTNatras = 'disabled';


  constructor(
    private productServices: ProductService,
    private categoriaService: CategoriaService
  ) {}
  ngOnChanges() {
    this.products = this.productsList;
    //  console.log(this.products);
  }
  ngOnInit() {
    this.categoriaService.getCategorias().subscribe();
    this.categorias$ = this.categoriaService.dataCateg$.pipe(
      map((resp) => resp.filter((x) => x.cantidadProduc > 0))
    );
  }

  pasarDataService(data: ProductGet) {
    this.productServices.recivedData([data]);
  }

  filtroProducts(e: any) {
    //console.log(e.detail.value);
    this.filterByCategoria.emit(e.detail.value);
  };

  pagina(e: Event) {
    const tar = e.target as HTMLButtonElement;
    if (Number(tar.textContent)) {
      this.PAGI = Number(tar.textContent);

      //console.log('FIRS',this.PAGI * 1);
       this.BTNatras = 'enabled'
      this.productServices.getAllProducts(undefined, this.CANTIDAD, this.PAGI).subscribe();
      this.products$ = this.productServices.dataPrAll$;
    }

    if (isNaN(Number(tar.textContent))) {
      //  this.PAGI  = 0;


      this.PAGI = tar.textContent === 'Next' ? this.PAGI + 1 : this.PAGI - 1;
      //  console.log(this.CANTIDAD , 'PLISS');

      if (this.PAGI <= 1) {

        console.log('Ultima pagina');
        this.productServices.getAllProducts(undefined, this.CANTIDAD, 1).subscribe();
        this.products$ = this.productServices.dataPrAll$;
        this.BTNatras = 'disabled'
        return this.PAGI = 1;

      } else {

        //console.log('SUIGIENTE', this.PAGI);

        this.productServices.getAllProducts(undefined, this.CANTIDAD, this.PAGI).subscribe();
        this.products$ = this.productServices.dataPrAll$;
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

}
