import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [ DashboardComponent ],
  imports: [
    CommonModule,
    IonicModule,
    // FormsModule,
  ],
  exports:[ DashboardComponent ]
})
export class DashboardModule { }
