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
  valueText1 = 'password';
  valueText2 = 'password';
  messeger = null;

  private passw1 = null;

  constructor(private fb: FormBuilder, private authSVS: AuthService) {
    this.formRegister = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName1: ['', Validators.required],
      lastName2: ['', Validators.required],
      dni: ['', Validators.required],
      phone: [9, [Validators.required, Validators.minLength(9)]], //chanf

      password: ['', Validators.required],
      confiPassword: ['', Validators.required], // cahnge
      //genero: ['', Validators.required], // NO requerido
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
}
