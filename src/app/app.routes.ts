import { Routes } from '@angular/router';
import { CartComponent } from './view/pages/user/cart/cart.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/customers',
    pathMatch: 'full',
  },
  { path: 'cart', component: CartComponent },

  {
    path: 'my-account',
    loadComponent: () =>
      import('./view/pages/user/my-account/my-account.component').then(
        (m) => m.MyAccountComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'payment-methods',
        pathMatch: 'full',
      },
      {
        path: 'account-details',
        loadComponent: () =>
          import(
            './view/pages/user/my-account/pages/account-details/account-details.component'
          ).then((m) => m.AccountDetailsComponent),
      },
      {
        path: 'payment-methods',
        loadComponent: () =>
          import(
            './view/pages/user/my-account/pages/payment-methods/payment-methods.component'
          ).then((m) => m.PaymentMethodsComponent),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./view/pages/admin/admin.component').then(
        (m) => m.AdminComponent
      ),
    children: [
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   data: { title: 'Dashboard' },
      // },
      {
        path: 'customers',
        pathMatch: 'full',

        loadComponent: () =>
          import('./view/pages/admin/users/users.component').then(
            (m) => m.UsersComponent
          ),
        data: { title: 'Customers' },
      },
      {
        path: 'products',
        pathMatch: 'full',

        loadComponent: () =>
          import('./view/pages/admin/products/products.component').then(
            (m) => m.ProductsComponent
          ),
        data: { title: 'Products' },
      },
      {
        path: 'add-product',
        pathMatch: 'full',
        loadComponent: () =>
          import('./view/pages/admin/add-product/add-product.component').then(
            (m) => m.AddProductComponent
          ),
        data: { title: 'Add Product' },
      },
    ],
  },
];
