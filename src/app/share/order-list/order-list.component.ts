import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { debounceTime, finalize, map, tap } from 'rxjs/operators';
import { LoadingService } from 'src/app/components/shares/loading/loading.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderGet } from 'src/model/order.model';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  // providers: [LoadingService],
})
export class OrderListComponent implements OnInit {
  //ordersCompleted$: Observable<OrderGet[]>;
  ordersEnd$: Observable<OrderGet[]>;
  ordersNoEnd$: Observable<OrderGet[]>;

  segment = 'no-completed';

  constructor(
    private router: Router,
    private orderService: OrderService,
    private loandingService: LoadingService
  ) {}

  ngOnInit() {
    this.orderService.getOrdersByUser();
    const orders$ = this.orderService.dataOrders$;

    const ordersAll$ =
      this.loandingService.showLoaderUntilCompleted<OrderGet[]>(orders$);

    this.ordersNoEnd$ = ordersAll$.pipe(
      // tap(() => (this.segment = 'no-completed')),
      tap((x) => console.log(x)),
      debounceTime(300),
      map((resp) => resp.filter((x) => x.statusOrder !== 'completed')),
      tap(() => this.loandingService.loadingOff())
    );

    // this.ordersEnd$.subscribe((resp) => console.log('1', resp));
    // this.ordersNoEnd$.subscribe((resp) => console.log('2', resp));
  }

  cambioSegment(e: CustomEvent) {
    const busqueda = e.detail.value;
    // console.log(e.detail.value);
    this.segment = busqueda;

    const orders$ = this.orderService.dataOrders$;
    this.ordersNoEnd$ = orders$.pipe(
      map((resp) => resp.filter((x) => x.statusOrder !== busqueda))
      //  finalize(() => this.loandingService.loadingOff())
    );

    this.ordersEnd$ = orders$.pipe(
      map((resp) => resp.filter((x) => x.statusOrder === busqueda))
      //    finalize(() => this.loandingService.loadingOff())
    );
  }
  routerLinkRetro() {
    this.router.navigateByUrl('/user');
  }
}
