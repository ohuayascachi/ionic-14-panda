import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
    console.log(clientID);
  }

  routerLinkRetro() {
    this.router.navigateByUrl('/user');
  }
}
