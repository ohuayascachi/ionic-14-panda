import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoadingService } from 'src/app/components/shares/loading/loading.service';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerGet } from 'src/model/customer.model';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  public clientes$: Observable<CustomerGet[]>;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    const clientesList$ = this.customerService.getCustomersByUser();
    this.clientes$ =
      this.loadingService.showLoaderUntilCompleted<CustomerGet[]>(
        clientesList$
      );

    this.clientes$.subscribe();
  }

  // PENDIENTE PARA CREAR DELETE CONDICIONADO
  // iF CLIENT HAVE EVENT A CART DESTINATION , NO IS POSIBIBLE DELETE IT.
  deleteClient(clientID: string) {
    this.customerService
      .delteCustomer(clientID)
      .pipe(
        tap((x: any) => {
          if (x === undefined || x === null) {
            // console.log('aqui1');
            return;
          }

          if (x.msg !== 'success') {
            // console.log('aqui2');
            return;
          } else {
            this.quitarItem(clientID);
          }
        })
      )
      .subscribe();
  }

  quitarItem(clientID: string) {
    // console.log(clientID);
    this.clientes$ = this.clientes$.pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  routerLinkRetro() {
    this.router.navigateByUrl('/user');
  }
}
