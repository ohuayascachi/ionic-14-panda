import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';

const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'log-in',
        loadChildren: () =>
          import('./auth/log-in/log-in.module').then((m) => m.LogInModule),
      },
      {
        path: 'sign-in',
        loadChildren: () =>
          import('./auth/sign-in/sign-in.module').then((m) => m.SignInModule),
      },

      {
        path: '',
        redirectTo: '/auth/log-in',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: '',
    redirectTo: '/auth/log-in',
    pathMatch: 'full',
  },

  // {
  //   path: '',
  //   redirectTo: '/products',
  //   pathMatch: 'full',
  //   component: ProductsComponent,
  //   loadChildren: () =>
  //     import('./components/products/products.module').then(
  //       (m) => m.ProductsModule
  //     ),
  // },

  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./share/share.module').then((m) => m.ShareModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
