import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../service/auth.service';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.scss'],
    standalone: false
})
export class LogInComponent implements OnInit {
  formLogin: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
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
    if (this.formLogin.valid) {
      this.authService.postLogin(this.formLogin.value).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
}
