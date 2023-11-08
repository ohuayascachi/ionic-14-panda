import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { LoadingComponent } from '../shares/loading/loading.component';
import { CardListOrdersComponent } from 'src/app/share/card-list-orders/card-list-orders.component';
import { ProductsModule } from '../products/products.module';
import { SharesModule } from '../shares/shares.module';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
})
export class InventoryModule {}
