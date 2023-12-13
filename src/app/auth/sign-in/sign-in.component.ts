/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  formRegister: FormGroup;
  formRegisterSeller: FormGroup;
  valueText1 = 'password';
  valueText2 = 'password';
  messeger = null;
  screemSeller = false;
  tittleRegister = 'Registrarse';
  private passw1 = null;

  constructor(private fb: FormBuilder, private authSVS: AuthService) {
    this.formRegister = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName1: ['', Validators.required],
      lastName2: ['', Validators.required],
      dni: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(9)]], //chanf
      role: ['general', Validators.required],
      password: ['', Validators.required],
      confiPassword: ['', Validators.required], // cahnge
    });
  }

  ngOnInit() {
    // this.formRegister.get('veryPassword').dirty;
    this.formRegister.get('password').valueChanges.subscribe((resp) => {
      this.passw1 = resp;
    });

    this.formRegister.get('confiPassword').valueChanges.subscribe((resp) => {
      if (this.passw1 === resp) {
        this.messeger = 'Las contraseñas son iguales';
      } else {
        this.messeger = 'Las contraseñas no son iguales';
      }
    });
  }

  onSubmit() {
    const nuevoUser = this.authSVS.postUser(this.formRegister.value);
  }

  verPassword1() {
    //const result = e.target.attributes.value.value;

    if (this.valueText1 === 'password') {
      this.valueText1 = 'text';
    } else {
      this.valueText1 = 'password';
    }
  }

  verPassword2() {
    if (this.valueText2 === 'password') {
      this.valueText2 = 'text';
    } else {
      this.valueText2 = 'password';
    }
  }

  registerLikeSeller() {
    this.screemSeller = true;
    this.tittleRegister = 'Vendedor';
    this.formRegister.get('role').setValue('seller-1');
  }
}
