import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { InventoryModule } from '../components/inventory/inventory.module';
import { CardListOrdersComponent } from '../share/card-list-orders/card-list-orders.component';
import { LoadingComponent } from '../components/shares/loading/loading.component';
import { InventoryComponent } from '../components/inventory/inventory.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    //InventoryModule,
    Tab3PageRoutingModule,
    // ProductsModule,
  ],
  declarations: [],
  exports: [],
})
export class Tab3PageModule {}
