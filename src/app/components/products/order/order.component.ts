/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, map, tap, timeout } from 'rxjs/operators';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { CustomerGet } from 'src/model/customer.model';
import { OrderGet } from 'src/model/order.model';
import { Router } from '@angular/router';
import { LoadingService } from '../../shares/loading/loading.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Storage } from '@ionic/storage-angular';
import { UserGet, Adress } from 'src/model/user.model';
import { UserService } from 'src/app/services/user.service';
import { CartGet } from 'src/model/cart.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, OnDestroy {
  @ViewChild('popover') popover;
  isOpen = false;

  //Forms
  formClient: FormGroup;
  formOrder: FormGroup;

  public customer: CustomerGet;
  public classInputNumber1 = false;
  public classInputNumber2 = false;
  timeBusqueda = false;
  messegeFormNumber = '';
  public addresSelected;

  //Variables
  public envio = 0;
  public descuento = 0;
  public tipoMoneda = 'S/';
  public idSelect: string;
  public clients$: Observable<CustomerGet[]>;
  public subtotal$: Observable<number> = of(0);
  public totalPricing$: Observable<number> = of(0);

  // Observables
  existOrder = false;
  // orderSeleted$: Observable<OrderProductGet[]>;
  orderCompleted$: Observable<OrderGet[]>;
  cantidadItems$: Observable<any> = of(0);
  isLogged$: Observable<boolean>;
  carrito$: Observable<CartGet[]>;
  metodosPago = [
    { name: 'Transferencia bancaría', check: false },
    { name: 'Pago efectivo', check: false },
    { name: 'Yape/Plin/Tunke', check: false },
    { name: 'Otros', check: false },
  ];
  docSolicitado = [{ name: 'Boleta' }, { name: 'Factura' }];

  yoMismo: UserGet;
  fullName: string;
  telefono: string;
  direccion: Adress | any;
  user$: Observable<UserGet>;
  carList = false;
  direccionReferencia: string;
  userID: string;
  preciosSub: number[] = [];
  userRole$: Observable<string>;

  // Subcrition
  orderSelectSubc: Subscription;
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private orderService: OrderService,
    private router: Router,
    public loadingService: LoadingService,
    private alertController: AlertController,
    public authService: AuthService,
    private storage: Storage,
    private userService: UserService
  ) {
    this.formClient = this.fb.group({
      phone: [
        '987654322',
        [
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.required,
        ],
      ],
    });

    this.formOrder = this.fb.group({
      cartSelected: this.fb.array([], Validators.required),
      client: [null], //ok
      //total: ['', Validators.required],  //no es necesario
      metodoPago: ['', Validators.required], //ok
      docSolitado: ['Boleta'],
      // statusOrder: ['crate'],
      comment: ['ok', Validators.maxLength(200)], //ok
    });
  }

  get tokenIn(): Observable<boolean> {
    const token$ = of(!!localStorage.getItem('token'));
    return token$;
  }

  get productsArray() {
    return this.formOrder.controls.cartSelected as FormArray;
  }

  async ngOnInit() {
    this.isLogged$ = this.tokenIn || this.authService.isLoggedIn$;

    this.customerService.getCustomersByUser().subscribe();
    this.clients$ = this.customerService.dataClientByUser$;

    this.datasOfUser();

    this.getCarritoByUser();

    // precio total
    this.subtotal$ = this.orderService.dataSubtotal$.pipe(
      debounceTime(300),
      map((resp) => {
        if (resp === undefined) {
          return 0;
        } else {
          return resp.total;
        }
      }),
      tap((resp) => {
        if (resp <= 99) {
          this.envio = 10;
        } else {
          this.envio = 0;
        }
      })
    );
  }

  orderUploaded(userOrders$: Observable<any>) {
    this.orderCompleted$ =
      this.loadingService.showLoaderUntilCompleted<OrderGet[]>(userOrders$);
    // this.orderCompleted$
    this.orderCompleted$
      .pipe(
        tap((resp: any) => {
          this.envio = resp.envio;
          this.descuento = resp.descuento;
          this.tipoMoneda = resp.typeMoneda;
          this.idSelect = resp._id;
        })
      )
      .subscribe();
  }

  presentPopover(e: Event) {
    const nuevo = { isTrusted: e.isTrusted };
    this.popover.event = nuevo;
    this.isOpen = true;
  }

  agregarUser(numero: string) {
    // const letter = this.formClient.get('phone').value;
    const sinEspacios = numero.replace(/ /g, '');

    this.router.navigate(['/customer', sinEspacios]);
  }

  metodoPago(e: CustomEvent) {
    // console.log(e.detail);
    // this.formOrderProducts.get('metodoPago').setValue(e.detail.value);
  }

  postPedido() {
    this.orderService.postOrder(this.formOrder.value);

    // this.router.navigate(['orders-list']);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Exitoso!',
      subHeader: 'Pedido registrado exitosamente',
      message: 'Ir a registro de pedidos',
      buttons: [
        {
          text: 'Ok',
          role: 'confirm',
          handler: () => {
            this.toGoPedidos();
          },
        },
      ],
    });

    await alert.present();
  }

  toGoPedidos() {
    this.router.navigate(['orders-list']);
  }

  cerrarOrder() {
    //this.router.navigateByUrl('/user');
    this.router.navigate(['user']);
    this.orderService.conseguirCarritoByUser();

    this.orderCompleted$ = null;
  }

  selectClient(e: any) {
    // console.log(e.target.value, 'target');
    // console.log('userID', this.userID);
    if (e.target.value === 'yo') {
      this.formOrder.get('client').setValue(null);
      this.fullName = this.yoMismo.name + ' ' + this.yoMismo.lastName1;
      this.telefono = this.yoMismo.phone;
      if (!this.yoMismo.adress) {
        this.direccion = 'Sin direccion';
      } else {
        this.direccion =
          this.yoMismo.adress.adress.location +
          ', ' +
          this.yoMismo.adress.distrito +
          ', ' +
          this.yoMismo.adress.provincia +
          ', ' +
          this.yoMismo.adress.estado +
          ', ' +
          this.yoMismo.adress.pais;

        this.direccionReferencia = this.yoMismo.adress.adress.reference;
      }
    } else {
      this.clients$
        .pipe(
          map((x) => x.filter((y) => y.id === e.target.value))
          // tap((x) => console.log(x))
        )
        .subscribe((resp) => {
          if (resp === undefined) {
            return;
          }
          this.formOrder.get('client').setValue(resp[0]._id);
          this.fullName = resp[0].name + ' ' + resp[0].lastName1;
          this.telefono = resp[0].phone;
          this.direccion =
            resp[0].adress.adress.location +
            ', ' +
            resp[0].adress.distrito +
            ', ' +
            resp[0].adress.provincia +
            ', ' +
            resp[0].adress.estado +
            ', ' +
            resp[0].adress.pais;

          this.direccionReferencia = resp[0].adress.adress.reference;
        });
    }
  }

  datasOfUser() {
    this.userService.getUser();
    const user$ = this.userService.dataUser$;
    this.user$ = this.loadingService.showLoaderUntilCompleted<UserGet>(user$);
    this.user$
      // .pipe(tap((resp) => console.log(resp)))
      // .pipe(tap((resp) => (this.userRole$ = of(resp.role))))

      .subscribe((x) => {
        if (x) {
          //console.log(x);
          //Nombre del usuario q inicio session
          this.userRole$ = of(x.role);
          this.yoMismo = x;
          this.fullName = x.name + ' ' + x.lastName1;
          this.telefono = x.phone;
          this.userID = x.id;
          if (!x.adress) {
            this.direccion = 'Sin direccion';
          } else {
            this.direccion =
              x.adress.adress.location +
              ', ' +
              x.adress.distrito +
              ', ' +
              x.adress.provincia +
              ', ' +
              x.adress.estado +
              ', ' +
              x.adress.pais;

            this.direccionReferencia = x.adress.adress.reference;
          }
          const result = x.carrito.filter(
            (y: CartGet) => y.colocacion === 'cart'
          );
          // if( !result ) {
          //    result = []}

          this.cantidadItems$ = of(result.length);
        }
      });
  }

  // Aqui tambien de add array de product de order
  getCarritoByUser() {
    this.orderService.conseguirCarritoByUser();
    this.orderService.dataCart$
      .pipe(
        tap((y) => (this.carrito$ = of(y))),
        tap((x) => {
          if (x === null) {
            return;
          }
          x.forEach((y) => {
            this.productsArray.push(this.fb.control(y._id));
          });
        })
      )
      .subscribe(() => {
        this.carList = true;
        // console.log('EN', this.carList);
        this.loadingService.loadingOff();
      });
  }

  // CANTIDAD OBTENER NUEVO ARRAY DE CART CAMBIADO LA CANTIDAD
  patchCountCart(data: any) {
    this.orderService.updatedCantidad(data);
    this.subtotal$ = this.orderService.dataSubtotal$.pipe(
      debounceTime(300),
      map((resp) => resp.total),
      tap((resp) => {
        if (resp <= 99) {
          this.envio = 10;
        } else {
          this.envio = 0;
        }
      })
    );
  }

  deleteArrayCart(idCart: any) {
    const arr = this.formOrder.get('cartSelected').value;
    const index = arr.findIndex((x) => x === idCart);
    // console.log(index);

    this.productsArray.removeAt(index);
  }

  ngOnDestroy() {
    // this.getCarritoByUser();
    this.orderCompleted$ = null;
  }
}

//this.orderService.getOrderByUser();
// const userOrders$ = this.orderService.getOrderUpdatedCompletedListener();
// Retorna la orden con todo los campos de pedido completo: client, comment, direccion, etc

// userOrders$
//   .pipe(
//     tap((resp) => {
//       if (resp === null) {
//         this.existOrder = false;
//         this.totalPricing = 0;
//         this.subtotal = 0;
//         this.envio = 0;
//         this.descuento = 0;
//         this.tipoMoneda = 's/';
//       } else if (resp !== null) {
//         //this.orderCompleted$.subscribe();
//         this.orderUploaded(of(resp));
//         this.existOrder = true;
//       }
//     })
//   )
//   .subscribe((xx) => console.log('ddd', xx));
//Para ver el numero de celular del cliente y verificar si existe
// this.formClient
//   .get('phone')
//   .valueChanges.pipe(distinctUntilChanged(), debounceTime(1000))
//   .subscribe((val) => {
//     // console.log('cambio un valor, logitud' + ' ' + val, val.length); // Lineas abajo se ejecuta si es valido el form
//     const numeroCel = val.replace(/ /g, '');

//     if (numeroCel.length === 9 && this.formClient.get('phone').dirty) {
//       this.messegeFormNumber = '';

//       // Simulamos que tomara un tiempo de busqueda en BD 2Seg
//       this.customerService
//         .getCustomerNumber(numeroCel)
//         .subscribe((respData) => {
//           this.timeBusqueda = false;
//           if (respData.ok === false) {
//             this.classInputNumber1 = false;
//             this.classInputNumber2 = true;
//           } else {
//             this.classInputNumber1 = true;
//             this.classInputNumber2 = false;
//             this.customer = respData.item;

//             this.formOrderProducts
//               .get('client')
//               .setValue(this.customer._id);
//             this.formOrderProducts
//               .get('direccion')
//               .setValue(this.customer.adress);
//           }
//         });

//       this.timeBusqueda = true;
//       this.classInputNumber2 = false;
//       this.classInputNumber1 = false;
//       // };
//     } else {
//       this.classInputNumber2 = false;
//       this.classInputNumber1 = false;
//       this.messegeFormNumber = 'Número no valido';
//     }
//   });
