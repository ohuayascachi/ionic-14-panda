import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab4Page } from './tab4.page';

import { Tab4PageRoutingModule } from './tab4-routing.module';

import { UserModule } from '../components/user/user.module';
import { ShareModule } from '../share/share.module';
import { LoadingComponent } from '../components/shares/loading/loading.component';
import { SharesModule } from '../components/shares/shares.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    UserModule,
    SharesModule,

    // RouterModule.forChild([{ path: '', component: Tab3Page }]),
    Tab4PageRoutingModule,
  ],
  declarations: [
    //  Tab4Page
  ],
  exports: [],
})
export class Tab4PageModule {}
