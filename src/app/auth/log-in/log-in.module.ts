import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LogInComponent } from './log-in.component';
import { LoginRoutingModule } from './login-routing.module';



@NgModule({

  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    LoginRoutingModule
  ],
  declarations: [LogInComponent ],
  exports: [LogInComponent]
})
export class LogInModule { }
