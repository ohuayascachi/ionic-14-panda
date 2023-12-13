import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  products: ProductGet[] = [];
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
  }
}
