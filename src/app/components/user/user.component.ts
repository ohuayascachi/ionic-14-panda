import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/service/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { UserGet } from 'src/model/user.model';

import { LoadingService } from '../shares/loading/loading.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  @Input() usuario: UserGet;

  isLoggedInd$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  carrito$: Observable<number>;
  user: UserGet;
  role: string;
  user$: Observable<UserGet>;
  showContent = false;

  //Subcrutions

  constructor(
    private authService: AuthService,
    public orderService: OrderService,
    private router: Router,
    public loading: LoadingService
  ) {}

  get tokenIn(): Observable<boolean> {
    const token$ = of(!!localStorage.getItem('token'));
    return token$;
  }

  get tokenOut(): Observable<boolean> {
    const token$ = of(!!!localStorage.getItem('token'));
    return token$;
  }

  async ngOnInit() {
    // console.log('Se inicio ngOnit-userComponente');

    this.authService.isLoggedIn$.subscribe();
    const loginIn$ = this.authService.isLoggedIn$;
    const loginOut$ = this.authService.isLoggedOut$;

    this.isLoggedInd$ = this.tokenIn || loginIn$;
    this.isLoggedOut$ = this.tokenOut || loginOut$;
    // this.isLoggedInd$.subscribe((x) => console.log('in', x));
    // this.isLoggedOut$.subscribe((x) => console.log('out', x));

    this.datasOfUser();
    this.obtenerCarritoByUser();
  }

  logout() {
    this.authService.postLogout();
  }

  rediretToLoggIn() {
    this.router.navigateByUrl('auth/log-in');
  }

  //Obtener los datos de usuario desde el servidor y por ID
  async datasOfUser() {

    this.role = this.usuario.role;
    this.showContent = true;
    this.loading.loadingOff();
  }

  ngOnDestroy() {
    this.role = 'general';
  }

  updated() {
    this.datasOfUser();
  }

  //Obetener array de carrito
  obtenerCarritoByUser() {
    this.orderService.conseguirCarritoByUser();
    this.carrito$ = this.orderService.dataCart$.pipe(
      map((resp) => {
        if (resp !== null) {
          return resp.length;
        }
      })
    );
  }
}
