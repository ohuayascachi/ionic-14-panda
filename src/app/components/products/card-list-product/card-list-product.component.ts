import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fromEvent, Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { OrderGet } from 'src/model/order.model';
import { OrderService } from 'src/app/services/order.service';
import { UserGet } from 'src/model/user.model';
import { LoadingService } from '../../shares/loading/loading.service';
import { CartGet } from 'src/model/cart.model';

@Component({
    selector: 'app-card-list-product',
    templateUrl: './card-list-product.component.html',
    styleUrls: ['./card-list-product.component.scss'],
    standalone: false
})
export class CardListProductComponent implements OnInit {
  @Input()
  idOrdes: OrderGet;

  @Input()
  user: UserGet;

  @Input()
  cart: CartGet[] = [];

  @Output() pricingChanged = new EventEmitter<any>();
  @Output() delCart = new EventEmitter<any>();

  //Variables
  orders: CartGet[] = [];
  pricingOfTrue = false;

  private numerosArray: number[] = [];

  //Obseervables

  //forms

  constructor(
    // public loadingService: LoadingService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    for (let i = 1; i < 101; i++) {
      this.numerosArray.push(i);
    }
    setTimeout(() => {
    //  console.log(this.cart);
    }, 150);
  }

  detectedId() {}

  qtyChange(idCart: string, idPro: any, e: KeyboardEvent) {
    const target = e.target as HTMLButtonElement;
    this.cargarPricing();

    setTimeout(() => {
      this.pricingOfTrue = false;
    }, 100);

    const data = { cart: idCart, product: idPro, count: target.value };
    if (!!data.cart && !!data.count && !!data.product) {
      this.pricingChanged.emit(data);
    }
  }

  cargarPricing() {
    this.pricingOfTrue = true;
  }

  deleteCart(id: string) {
    this.delCart.emit(id);
    this.orderService.eliminarCart(id);
  }
}
