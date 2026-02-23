import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule]
})
export class LogInComponent implements OnInit {
  formLogin: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

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

  ngOnInit() {}

  onSubmit() {
    if (this.formLogin.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      this.authService.postLogin(this.formLogin.value).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(err);
          this.errorMessage.set(err.error?.message || 'Login failed');
        },
      });
    } else {
        this.errorMessage.set('Please check your input.');
    }
  }
}
