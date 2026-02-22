import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../shares/loading/loading.service';
import { OrderService } from 'src/app/services/order.service';
import { Observable } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { OrderGet } from 'src/model/order.model';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.scss'],
    standalone: false
})
export class InventoryComponent implements OnInit {
  //OBSERVABLES
  ordersEnd$: Observable<OrderGet[]>;
  ordersNoEnd$: Observable<OrderGet[]>;

  segment = 'no-completed';
  constructor(
    private orderService: OrderService,
    private loandingService: LoadingService
  ) {}

  ngOnInit() {
    this.orderService.getAllOrdersForRoot();
    const orders$ = this.orderService.dataOrders$;
    const ordersAll$ =
      this.loandingService.showLoaderUntilCompleted<OrderGet[]>(orders$);

    this.ordersNoEnd$ = ordersAll$.pipe(
      // tap(() => (this.segment = 'no-completed')),
      // tap((x) => console.log(x)),
      //debounceTime(300),
      map((resp) =>{ 
        if( resp == null){
          return;
        }else{
          this.loandingService.loadingOff();
          return resp.filter((x) => x.statusOrder !== 'completed');
            
        }
       
      }),
     // tap(() => this.loandingService.loadingOff())
    );
  }

  cambioSegment(e: CustomEvent) {
    const busqueda = e.detail.value;
    // console.log(e.detail.value);
    this.segment = busqueda;

    const orders$ = this.orderService.dataOrders$;
    this.ordersNoEnd$ = orders$.pipe(
      map((resp) => resp.filter((x) => x.statusOrder !== 'completed'))
      //  finalize(() => this.loandingService.loadingOff())
    );

    this.ordersEnd$ = orders$.pipe(
      map((resp) => resp.filter((x) => x.statusOrder === busqueda))
      //    finalize(() => this.loandingService.loadingOff())
    );
  }
}
