import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'my-account',
    pathMatch: 'full',
  },
  {
    path: 'my-account',
    loadComponent: () =>
      import('./view/pages/my-account/my-account.component').then(
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
            './view/pages/my-account/pages/account-details/account-details.component'
          ).then((m) => m.AccountDetailsComponent),
      },
      {
        path: 'payment-methods',
        loadComponent: () =>
          import(
            './view/pages/my-account/pages/payment-methods/payment-methods.component'
          ).then((m) => m.PaymentMethodsComponent),
      },
    ],
  },
];
