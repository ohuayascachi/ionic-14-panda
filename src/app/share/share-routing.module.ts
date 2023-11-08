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
import { ProductDetailsComponent } from './product-details/product-details.component';
// import { HistoricoVentaComponent } from './historico-venta/historico-venta.component';
import { PreciosComponent } from '../components/products/precios/precios.component';
import { PrecioProdComponent } from '../components/products/precio-prod/precio-prod.component';
import { PrecioListComponent } from '../components/products/precio-list/precio-list.component';
import { UserGeneralGuard } from '../user-general.guard';
import { ProductsListComponent } from '../components/products/products-list/products-list.component';

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
    path: 'list-products',
    component: ProductsListComponent,
  },
  // {
  //   path: 'historico',
  //   component: HistoricoVentaComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareRoutingModule {}
