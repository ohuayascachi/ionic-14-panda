import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { OrderComponent } from './components/products/order/order.component';
import { LoadingService } from './components/shares/loading/loading.service';

import { IonicStorageModule } from '@ionic/storage-angular';
import { SharesModule } from './components/shares/shares.module';
import { Tab3PageModule } from './tab3/tab3.module';
import { LoadingComponent } from './components/shares/loading/loading.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { CardListOrdersComponent } from './share/card-list-orders/card-list-orders.component';
import { Tab3Page } from './tab3/tab3.page';
import { Tab4Page } from './tab4/tab4.page';
import { UserComponent } from './components/user/user.component';
import { ListProductsComponent } from './components/products/list-products/list-products.component';
import { ProductsComponent } from './components/products/products.component';
import { Tab2Page } from './tab2/tab2.page';
import { HeaderComponent } from './share/header/header.component';
import { CardListProductComponent } from './components/products/card-list-product/card-list-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerListComponent } from './share/customer-list/customer-list.component';
import { OrderListComponent } from './share/order-list/order-list.component';
import { CostComponent } from './components/costos/cost/cost.component';
import { UploadImgComponent } from './components/products/upload-img/upload-img.component';
import { SearchComponent } from './components/products/search/search.component';
import { MyProdListComponent } from './components/products/my-prod-list/my-prod-list.component';
import { MydatosComponent } from './share/mydatos/mydatos.component';

@NgModule({ declarations: [
        AppComponent,
        CardListOrdersComponent,
        LoadingComponent,
        InventoryComponent,
        Tab2Page,
        Tab3Page,
        Tab4Page,
        UserComponent,
        ListProductsComponent,
        ProductsComponent,
        OrderComponent,
        HeaderComponent,
        CardListProductComponent,
        CustomerListComponent,
        OrderListComponent,
        CostComponent,
        UploadImgComponent,
        SearchComponent,
        MyProdListComponent,
        MydatosComponent
    ],
    bootstrap: [AppComponent],
    // exports: [
    //   ...fromPipes.pipes
    // ]
    exports: [
        CardListOrdersComponent,
        LoadingComponent,
        //InventoryComponent,
        Tab3Page,
    ], imports: [BrowserModule,
        CommonModule,
        ReactiveFormsModule,
        SwiperModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot(),
        SharesModule,
        //ShareModule,
        Tab3PageModule], providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        CookieService,
        LoadingService,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
