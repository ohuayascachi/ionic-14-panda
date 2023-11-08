import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RouterModule } from '@angular/router';
import { SharesModule } from '../shares/shares.module';
import { LoadingComponent } from '../shares/loading/loading.component';

@NgModule({
  declarations: [
    // UserComponent
  ],
  imports: [CommonModule, RouterModule, SharesModule],
  exports: [
    // UserComponent
  ],
})
export class UserModule {}
