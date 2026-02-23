import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'log-in',
        loadComponent: () =>
          import('./auth/log-in/log-in.component').then((m) => m.LogInComponent),
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
    redirectTo: '/products',
    pathMatch: 'full',
  },
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
  {
      path: 'products',
      loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent)
  },
  {
      path: 'products/:slug',
      loadComponent: () => import('./components/products/item-product/item-product.component').then(m => m.ItemProductComponent)
  }
];
