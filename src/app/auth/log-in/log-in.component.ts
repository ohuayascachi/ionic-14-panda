import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  formLogin: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.formLogin = this.fb.group({
      phone: [
        '',
        [Validators.maxLength(9), Validators.minLength(9), Validators.required],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  //999999994

  //12345678

  ngOnInit() {}

  onSubmit() {
    this.authService.postLogin(this.formLogin.value);
  }
}
