import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from '../components/products/add-product/add-product.component';
import { ItemProductComponent } from '../components/products/item-product/item-product.component';
import { ListProductsComponent } from '../components/products/list-products/list-products.component';

import { OrderComponent } from '../components/products/order/order.component';
import { ProductResolver } from '../resolver/product.resolver';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerComponent } from './customer/customer.component';
import { OrderListComponent } from './order-list/order-list.component';
// import { HistoricoVentaComponent } from './historico-venta/historico-venta.component';
import { PreciosComponent } from '../components/products/precios/precios.component';
import { PrecioProdComponent } from '../components/products/precio-prod/precio-prod.component';
import { PrecioListComponent } from '../components/products/precio-list/precio-list.component';
import { UserGeneralGuard } from '../user-general.guard';
import { ProductsListComponent } from '../components/products/products-list/products-list.component';
import { CostComponent } from '../components/costos/cost/cost.component';
import { SimulacionComponent } from '../components/costos/simulacion/simulacion.component';
import { UploadImgComponent } from '../components/products/upload-img/upload-img.component';
import { MyProdListComponent } from '../components/products/my-prod-list/my-prod-list.component';
import { MydatosComponent } from './mydatos/mydatos.component';

const routes: Routes = [
  {
    path: 'order',
    component: OrderComponent,
  },
  {
    path: 'orders-list',
    component: OrderListComponent,
  },
  {
    path: 'products',
    component: ListProductsComponent,
  },
  {
    path: 'products/:prod',
    component: ItemProductComponent,
    resolve: {
      productSlug: ProductResolver,
    },
  },
  {
    path: 'prices',
    component: PreciosComponent,
    canActivate: [UserGeneralGuard],
  },
  {
    path: 'prices-list',
    component: PrecioListComponent,
    //canActivate: [UserGeneralGuard],
  },

  {
    path: 'prices/:prod',
    component: PrecioProdComponent,
  },
  {
    path: 'costos',
    component: CostComponent,
    // canActivate: [UserGeneralGuard],
  },

  {
    path: 'simulacion',
    component: SimulacionComponent,
    canActivate: [UserGeneralGuard],
  },
  {
    path: 'customer',
    component: CustomerComponent,
  },
  {
    path: 'customer/:phone',
    component: CustomerComponent,
  },

  {
    path: 'customer-list',
    component: CustomerListComponent,
  },
  {
    path: 'add-product',
    component: AddProductComponent,
  },
  {
    path: 'uploand-img',
    component: UploadImgComponent,
  },
  {
    path: 'list-products',
    component: ProductsListComponent,
  },
  {
    path: 'my-products',
    component: MyProdListComponent,
  },
  {
    path: 'mydatos',
    component: MydatosComponent,
  },
  // {
  //   path: 'historico', mydatos
  //   component: HistoricoVentaComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareRoutingModule { }
