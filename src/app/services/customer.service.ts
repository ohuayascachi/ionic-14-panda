import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CustomerGet, CustomerPost } from 'src/model/customer.model';

import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

const server = environment.serverDev;

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private subjectClientbyUser = new BehaviorSubject<CustomerGet[]>([]);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public dataClientByUser$: Observable<CustomerGet[]> =
    this.subjectClientbyUser.asObservable();

  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  // Para ver si el usuario existe
  getCustomerNumber(phone: string) {
    return this.http.get<{ ok: boolean; item: CustomerGet; msg: string }>(
      `${server}/client/${phone}`
    );
  }

  // Post new customer
  postCustomer(formCustomer: CustomerPost) {
    return this.http
      .post<{ item: CustomerGet; msg: string; count: number }>(
        `${server}/client`,
        formCustomer,
        this.headers
      )
      .pipe(catchError(this.errorHandler));
  }

  getCustomersByUser(): Observable<CustomerGet[]> {
    return this.http
      .get<{ item: CustomerGet[]; msg: string; count: number }>(
        `${server}/clientByUser`,
        this.headers
      )
      .pipe(
        //tap((resp) => console.log(resp)),
        map((resp) => resp.item),
        tap((resp) => this.subjectClientbyUser.next(resp))
      );
  }

  //Manejo de error
  errorHandler(er: HttpErrorResponse) {
    console.log(er);
    // this.islogingMsg$ = of(er.error.message);
    alert(er.error.message);
    return of(er.error.message);
  }
}
