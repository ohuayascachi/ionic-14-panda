import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ProductGet } from 'src/model/product.model';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit, OnChanges {
  @Input() productsList: ProductGet[] = [];

  @Output() filterByCategoria = new EventEmitter<string>();

  products: ProductGet[] = [];
  constructor(private productServices: ProductService) {}
  ngOnChanges() {
    this.products = this.productsList;
    // console.log(this.products);
  }
  ngOnInit() {
    // console.log(this.productsList);

    setTimeout(() => {
      console.log(this.products);
    }, 800);
  }

  pasarDataService(data: ProductGet) {
    this.productServices.recivedData([data]);
  }

  filtroProducts(e: CustomEvent) {
    //  console.log(e.detail.value);
    this.filterByCategoria.emit(e.detail.value);
  }
}
