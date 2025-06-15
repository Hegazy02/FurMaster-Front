import { Routes } from '@angular/router';
import { CartComponent } from './view/pages/user/cart/cart.component';
import { SuccessComponent } from './view/pages/user/success/success.component';
import { CancelComponent } from './view/pages/user/cancel/cancel.component';
import { UserOrdersComponent } from './view/pages/user/my-account/pages/user-orders/user-orders.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'admin/customers',
    pathMatch: 'full',
  },
  { path: 'cart', component: CartComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'cancel', component: CancelComponent },
  { path: 'orders', component: UserOrdersComponent },

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
      {
        path: 'customers',
        loadComponent: () =>
          import('./view/pages/admin/users/users.component').then(
            (m) => m.UsersComponent
          ),
        data: { title: 'Customers' },
      },
    ],
  },
];
