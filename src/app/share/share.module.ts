import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareRoutingModule } from './share-routing.module';

import { CustomerModule } from './customer/customer.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerListModule } from './customer-list/customer-list.module';
import { ItemProductModule } from '../components/products/item-product/item-product.module';
import { ProductsModule } from '../components/products/products.module';
import { LoadingComponent } from '../components/shares/loading/loading.component';
import { OrderListComponent } from './order-list/order-list.component';
import { LoadingService } from '../components/shares/loading/loading.service';
import { SharesModule } from '../components/shares/shares.module';
import { CardListOrdersComponent } from './card-list-orders/card-list-orders.component';
import { HeaderComponent } from './header/header.component';
import { InventoryModule } from '../components/inventory/inventory.module';

@NgModule({
  imports: [
    CommonModule,
    ShareRoutingModule,
    CustomerModule,
    ProductsModule,
    SharesModule,

    // ProductDetailsModule,
    FormsModule,
    CustomerListModule,
    // InventoryModule,
  ],

  declarations: [],
  providers: [LoadingService],
  exports: [],
})
export class ShareModule {}
