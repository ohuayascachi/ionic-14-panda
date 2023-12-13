import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { LoadingComponent } from 'src/app/components/shares/loading/loading.component';

import { SharesModule } from 'src/app/components/shares/shares.module';

@NgModule({
  declarations: [],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    SharesModule,

    //BrowserModule
  ],
  exports: [],
})
export class CustomerListModule {}
