import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { OrderComponent } from './order/order.component';
import { SearchComponent } from './search/search.component';
import { CustomerComponent } from './customer/customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoneNumberPipe } from 'src/app/pipes';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ItemProductModule } from './item-product/item-product.module';

import { AddProductComponent } from './add-product/add-product.component';
import { IonicModule } from '@ionic/angular';
import { LoadingComponent } from '../shares/loading/loading.component';
import { LoadingService } from '../shares/loading/loading.service';
import { CardListProductComponent } from './card-list-product/card-list-product.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { SharesModule } from '../shares/shares.module';
import { PreciosComponent } from './precios/precios.component';
import { PrecioProdComponent } from './precio-prod/precio-prod.component';
import { PrecioProdListComponent } from './precio-prod/precio-prod-list.component';
import { PrecioListComponent } from './precio-list/precio-list.component';
import { ShareModule } from 'src/app/share/share.module';
import { HeaderComponent } from 'src/app/share/header/header.component';
import { ProductsListComponent } from './products-list/products-list.component';

//shared

@NgModule({
  declarations: [
    // ProductsComponent,
    AddProductComponent,
    // OrderComponent,
    //SearchComponent,
    CustomerComponent,
    //ListProductsComponent,
    PhoneNumberPipe,
    //CardListProductComponent,
    PreciosComponent,
    PrecioProdComponent,
    PrecioListComponent,
    //CardListProductComponent,
    //HeaderComponent,
    //LoadingComponent,
    //PrecioProdListComponent,
    ProductsListComponent,

    // LoadingComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ItemProductModule,
    HttpClientModule,
    SharesModule,
    NgxStarRatingModule,
  ],

  exports: [
    //ProductsComponent,
    // HeaderComponent,
  ],

  providers: [],
})
export class ProductsModule {}
