import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, map, tap, timeInterval } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { UserGet } from 'src/model/user.model';

@Component({
  selector: 'app-mydatos',
  templateUrl: './mydatos.component.html',
  styleUrls: ['./mydatos.component.scss'],
})
export class MydatosComponent implements OnInit, OnDestroy  {
  //Form
  public formMyDato: FormGroup;

  //Variables
  show = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.formMyDato = this.fb.group({
      name: ['', [Validators.required]],
      name2: [
        '' ,
      ],
      lastName1: [
        // [
        //   Validators.minLength(2),
        //   Validators.maxLength(15),
        //   Validators.required,
        // ],
      ],
      lastName2: [''],
      photo: [],
      phone: [
        '',
        [Validators.minLength(9), Validators.maxLength(9), Validators.required],
      ],
      dni: [],

      email: [],
      gender: [],
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

      role: ['root'],
      // status: [true, Validators.required],
    });
  }

  ngOnInit() {
    this.userService.getUser();
    this.userService.dataUser$
      .pipe 
      ()
      .subscribe((resp) => {
        if (resp) {
          
          // setTimeout(() => {
            this.show = true;
          //   console.log('verdad',this.show);
          // },2000)

     
          delete resp.carrito;
          delete resp.nameFull;
          delete resp.registerOrder;
          delete resp.carrito;

          this.rellenarValor(resp);
        }
      });
  }

  postForm(){
    
    this.userService.patchUser(this.formMyDato.value)
  }

  rellenarValor(resp: UserGet) {
  //  console.log(resp);
    this.formMyDato.get('name').setValue(resp.name);
    this.formMyDato.get('name2').setValue(resp.name2);
    this.formMyDato.get('lastName1').setValue(resp.lastName1);
    this.formMyDato.get('lastName2').setValue(resp.lastName2 || '');
    this.formMyDato.get('photo').setValue(resp.photo);
    this.formMyDato.get('phone').setValue(resp.phone);
    this.formMyDato.get('dni').setValue(resp.dni);
    this.formMyDato.get('email').setValue(resp.email);
    this.formMyDato.get('gender').setValue(resp.gender);
    this.formMyDato.get('role').setValue(resp.role);
    // this.formMyDato.get('status').setValue(resp.status);

    if (resp.adress !== undefined) {
      this.formMyDato
        .get('adress')
        .get('pais')
        .setValue(resp.adress.pais || 'Perú');
      this.formMyDato
        .get('adress')
        .get('estado')
        .setValue(resp.adress.estado || 'Lima');

      this.formMyDato
        .get('adress')
        .get('provincia')
        .setValue(resp.adress.provincia || 'Lima');
      this.formMyDato
        .get('adress')
        .get('distrito')
        .setValue(resp.adress.distrito || '');
      this.formMyDato
        .get('adress')
        .get('adress')
        .get('location')
        .setValue(resp.adress.adress.location || '');
      this.formMyDato
        .get('adress')
        .get('adress')
        .get('reference')
        .setValue(resp.adress.adress.reference || '');
    }
  }

  routerLinkRetro() {
    this.router.navigate(['/user']);
  }

  ngOnDestroy() {
  
  }
}
