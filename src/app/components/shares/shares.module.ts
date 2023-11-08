import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { LoadingService } from './loading/loading.service';

@NgModule({
  //declarations: [],
  declarations: [], // Funciona bien 27-01-2023

  imports: [CommonModule],
  providers: [],
  //exports: [],
  exports: [], //Funcoiona bien 27-10.23
})
export class SharesModule {}
//LoadingComponent
