import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { CustomerComponent } from './customer.component';
import {RouterModule} from '@angular/router';
import { IonicModule } from '@ionic/angular';
 
 //import { PhoneNumberPipe } from 'src/app/pipes';

@NgModule({
  declarations: [ CustomerComponent,
  //PhoneNumberPipe
  ],
  imports: [
    IonicModule,
    
   
    //BrowserModule,
    CommonModule,
    FormsModule, ReactiveFormsModule,
    RouterModule
  ],
  exports: [ 
    CustomerComponent
   ],
})
export class CustomerModule { }
