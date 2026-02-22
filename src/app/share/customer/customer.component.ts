/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, map } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerGet } from 'src/model/customer.model';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit, OnDestroy {
  public formCustomer: FormGroup;
  public numeroPhone: string;
  public newDireccion: FormGroup;
  public newCuenta: FormGroup;
  pageBeforeOrder = false;
  pageBeforeUser = false;
  pageBeforeClientes = false;
  public mensajeMostrar;
  existeNumero: string;
  statuInput = false;
  statusNota = false;
  public btnName = 'Registrar';
  public idCustomer: string;

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
      empresa:[],
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
      locations: this.fb.group({
        // type: [],
        // coordinates:[]
      }),
      informacionBanco: this.fb.group({
        nombreBanco: [],
        cuenta: [],
        cci: [],
        titular: [],
      }),
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log(paramMap.has('phone'));
      if (paramMap.has('phone') && paramMap.get('phone')) {
        this.btnName = 'Actualizar';
        this.numeroPhone = paramMap.get('phone');
        const client$ = this.customerService.getCustomersByUser().pipe(
          map((resp) => resp.filter((x) => x.phone === this.numeroPhone)),
          map((res) => res[0]),
          map((res) => {
            this.idCustomer = res.id;
            delete res._id;
            delete res.id;
            delete res.createdUpdeted;
            delete res.createdAt;
            delete res.userRigister;
            delete res.__v;
            delete res.nameFull;
            delete res.order;
            return res;
          })
        );
        client$.subscribe((resp) => {
          this.pageBeforeClientes = true;
          this.pageBeforeOrder = false;
          this.pageBeforeUser = false;

          this.setValueOfCustumer(resp);
        });

        this.formCustomer.get('phone').setValue(paramMap.get('phone'));
        this.statuInput = true;
        this.statusNota = true;

        this.pageBeforeUser = false;
      } else if (!paramMap.has('phone') && paramMap.get('phone')) {
        this.pageBeforeOrder = true;
        this.pageBeforeUser = false;

        this.pageBeforeClientes = false;
      } else {
        this.pageBeforeUser = true;
        this.pageBeforeOrder = false;
        this.pageBeforeClientes = false;
      }
    });

    this.formCustomer
      .get('phone')
      .valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        map((resp) => {
          if (resp.length === 9) {
            return resp;
          }
        })
      )

      .subscribe((x) => {
        if (x === undefined) {
          return;
        } else {
          const resul$ = this.customerService.getCustomerNumber(x);
          resul$.subscribe((resp) => {
            this.existeNumero = resp.msg;
          });
        }
        // console.log(this.formCustomer.valid);
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
  async postForm( valor: string) {
    

    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      spinner: 'lines-sharp',
      animated: true,
      duration: 1000,
      cssClass: 'custom-loading',
    });

    if( valor === 'Actualizar'){

      loading.present().then(()=> {
        this.customerService.patchCustomer( this.idCustomer, this.formCustomer.value )
                .subscribe( resp => {
                  this.mensajeMostrar = resp;
                })
      })
      
    }else{
      loading.present().then(() => {
        console.log(this.formCustomer.value);
        this.customerService
          .postCustomer(this.formCustomer.value)
          .subscribe((postData) => {
            console.log(postData);
            this.mensajeMostrar = postData;
          });
      });
    }



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
    if (mensaje.msg === 'success') {
      const toast = await this.toastController.create({
        message: 'Se ha agregado correctamente',
        duration: 1100,
        position: position1,
        color: 'success',
      });

      await toast.present();
      await toast.onDidDismiss().then(() => {
        this.router.navigate(['/customer-list']);
      });
    } else {
      const toast = await this.toastController.create({
        message: mensaje.msg,
        duration: 1400,
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

  //Funciones de ayuda

  setValueOfCustumer(value: CustomerGet) {
    this.formCustomer.get('name').setValue(value.name);
    this.formCustomer.get('lastName1').setValue(value.lastName1);
    this.formCustomer.get('lastName2').setValue(value.lastName2);
    this.formCustomer.get('dni').setValue(value.dni);
    this.formCustomer.get('ruc').setValue(value.ruc);
    this.formCustomer.get('genero').setValue(value.genero);
    this.formCustomer.get('email').setValue(value.email);
    this.formCustomer.get('adress').get('pais').setValue(value.adress.pais);
    this.formCustomer.get('adress').get('estado').setValue(value.adress.estado);
    this.formCustomer
      .get('adress')
      .get('provincia')
      .setValue(value.adress.provincia);
    this.formCustomer
      .get('adress')
      .get('distrito')
      .setValue(value.adress.distrito);
    this.formCustomer
      .get('adress')
      .get('adress')
      .get('location')
      .setValue(value.adress.adress.location);
    this.formCustomer
      .get('adress')
      .get('adress')
      .get('reference')
      .setValue(value.adress.adress.reference);
    this.formCustomer
      .get('informacionBanco')
      .get('cci')
      .setValue(value.informacionBanco.cci);
    this.formCustomer
      .get('informacionBanco')
      .get('cuenta')
      .setValue(value.informacionBanco.cuenta);
    this.formCustomer
      .get('informacionBanco')
      .get('nombreBanco')
      .setValue(value.informacionBanco.nombreBanco);
    // this.formCustomer
    //   .get('informacionBanco')
    //   .get('status')
    //   .setValue(value.informacionBanco.status);
    this.formCustomer
      .get('informacionBanco')
      .get('titular')
      .setValue(value.informacionBanco.titular);
  }

  routerLinkRetro() {
    if (this.pageBeforeOrder && !this.pageBeforeUser) {
      this.router.navigate(['/order']);
    } else if (this.pageBeforeUser && !this.pageBeforeOrder) {
      console.log(this.pageBeforeUser, this.pageBeforeOrder);
      this.router.navigate(['/user']);
    } else if (this.pageBeforeClientes) {
      this.router.navigate(['/customer-list']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.pageBeforeOrder = false;
    this.pageBeforeUser = false;
  }
}
