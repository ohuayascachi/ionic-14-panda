/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  // template: '<h1> Hello Oscar </h1>',
  styleUrls: ['./customer.component.scss'],
  // styles: [
  //   `h1 {
  //       background-color: red;
  //     }`,
  // ],
})
export class CustomerComponent implements OnInit, OnDestroy {
  public formCustomer: FormGroup;
  public numeroPhone: string;
  public newDireccion: FormGroup;
  public newCuenta: FormGroup;
  pageBeforeOrder = false;
  pageBeforeUser = false;
  public mensajeMostrar;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private customerService: CustomerService,
    private route: ActivatedRoute
  ) {
    this.formCustomer = this.fb.group({
      phone: [
        '',
        [Validators.maxLength(9), Validators.minLength(9), Validators.required],
      ],
      name: [
        '',
        [
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.required,
        ],
      ],
      lastName1: [
        '',
        [
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.required,
        ],
      ],
      lastName2: [''],
      image: [],
      dni: [],
      ruc: [],
      genero: [],
      email: [],
      edad: this.fb.group({
        edad: [],
        verificado: [],
      }),
      adress: this.fb.group({
        pais: ['Perú', Validators.required],
        estado: ['Lima', Validators.required],
        provincia: ['Lima', Validators.required],
        distrito: [],
        adress: this.fb.group({
          location: [],
          reference: [],
        }),
      }),
      informacionBanco: this.fb.group({
        nombreBanco: [],
        cuenta: [],
        cci: [],
      }),
    });

    //For direction
    // this.newDireccion = this.fb.group({
    //   pais: ['Perú', Validators.required],
    //   estado: ['Lima', Validators.required],
    //   provincia: ['Lima', Validators.required],
    //   distrito: [],
    //   adress: this.fb.group({
    //     location: [],
    //     reference: [],
    //   }),
    // });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('phone')) {
        this.numeroPhone = paramMap.get('phone');
        this.pageBeforeOrder = true;
        this.pageBeforeUser = false;

        this.formCustomer.get('phone').setValue(paramMap.get('phone'));
      } else {
        this.pageBeforeUser = true;
        this.pageBeforeOrder = false;
      }
    });
    this.formCustomer.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(1000))
      .subscribe((x) => {
        console.log(x);
        console.log(this.formCustomer.valid);
      });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get lenthPhone() {
    const phoneTT = this.formCustomer.get('phone').value;
    const lenPhone = phoneTT.length;
    return lenPhone;
  }

  get formValid() {
    return this.formCustomer.invalid;
  }

  //Add new cliente
  async postForm() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      spinner: 'lines-sharp',
      animated: true,
      duration: 1000,
      cssClass: 'custom-loading',
    });

    loading.present().then(() => {
      this.customerService
        .postCustomer(this.formCustomer.value)
        .subscribe((postData) => {
          this.mensajeMostrar = postData;

          this.mensajeMostrar = postData;
        });
    });

    loading
      .onWillDismiss()
      .then(() => {
        this.postSuccess('bottom', this.mensajeMostrar);
      })
      // .then(()=>{
      //   this.formCustomer.reset();
      // })
      .catch(() => {
        this.postError('bottom');
      });
  }

  async postSuccess(position1: any, mensaje: any) {
    if (mensaje.ok === true) {
      const toast = await this.toastController.create({
        message: mensaje.msg,
        duration: 1500,
        position: position1,
        color: 'success',
      });

      await toast.present();
    } else {
      const toast = await this.toastController.create({
        message: mensaje.msg,
        duration: 1500,
        position: position1,
        color: 'warning',
      });

      await toast.present();
    }
  }

  async postError(position1: any) {
    const toast = await this.toastController.create({
      message: 'Succedio un error',
      duration: 1500,
      position: position1,
      color: 'danger',
    });

    await toast.present();
  }

  routerLinkRetro() {
    if (this.pageBeforeOrder && !this.pageBeforeUser) {
      this.router.navigate(['/order']);
    } else if (this.pageBeforeUser && !this.pageBeforeOrder) {
      console.log(this.pageBeforeUser, this.pageBeforeOrder);
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.pageBeforeOrder = false;
    this.pageBeforeUser = false;
  }
}

// get direccion() {
//   return this.formCustomer.controls.adress as FormArray;
// }

// get cuentaBancaria() {
//   return this.formCustomer.controls.informacionBanco as FormArray;
// }

// resetAdress() {
//   this.newDireccion.reset({
//     pais: ['Perú'],
//     estado: ['Lima'],
//     provincia: ['Lima'],
//     distrito: [],
//     adress: this.fb.group({
//       location: [],
//       reference: [],
//     }),
//   });
// }

// addCuentaBanco() {
//   this.newCuenta = this.fb.group({
//     nombreBanco: [],
//     cuenta: [],
//     cci: [],
//     status: [],
//     seleted: [],
//   });

//   this.cuentaBancaria.push(this.newCuenta);
//   console.log(this.formCustomer.get('informacionBanco').value);
// }

// deleteCuenta(cuentaIndex: number) {
//   this.cuentaBancaria.removeAt(cuentaIndex);
