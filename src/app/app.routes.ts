import { Routes } from '@angular/router';
import { CartComponent } from './view/pages/user/cart/cart.component';
import { SuccessComponent } from './view/pages/user/success/success.component';
import { CancelComponent } from './view/pages/user/cancel/cancel.component';
import { UserOrdersComponent } from './view/pages/user/my-account/pages/user-orders/user-orders.component';
import { authGuard } from './core/guards/auth.guard';
import { UserRole } from './core/interfaces/user.interface';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'cart', component: CartComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'cancel', component: CancelComponent },
  { path: 'orders', component: UserOrdersComponent },

  {
    path: 'signup',
    pathMatch: 'full',
    loadComponent: () =>
      import('./view/pages/auth/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },

  {
    path: 'login',
    pathMatch: 'full',
    loadComponent: () =>
      import('./view/pages/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: 'forgot-password',

    pathMatch: 'full',
    loadComponent: () =>
      import('./view/pages/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',

    pathMatch: 'full',
    loadComponent: () =>
      import('./view/pages/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },

  { path: 'cart', component: CartComponent },

  {
    path: 'my-account',
    loadComponent: () =>
      import('./view/pages/user/my-account/my-account.component').then(
        (m) => m.MyAccountComponent
      ),
    canActivate: [authGuard(UserRole.User)],
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
    canActivate: [authGuard(UserRole.Admin)],
    children: [
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   data: { title: 'Dashboard' },
      // },
      {
        path: 'orders',
        pathMatch: 'full',

        loadComponent: () =>
          import('./view/pages/admin/admin-orders/admin-orders.component').then(
            (m) => m.AdminOrdersComponent
          ),
        data: { title: 'Orders Management' },
      },
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
        path: 'products/:id',
        pathMatch: 'full',

        loadComponent: () =>
          import('./view/pages/admin/add-product/add-product.component').then(
            (m) => m.AddProductComponent
          ),
        data: { title: 'Update Product' },
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
  {
    path: 'products',
    loadComponent: () => import('./view/pages/user/products/products/product-listing.component').then(m => m.ProductListingComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./view/pages/user/products/product-detail/product-detail-page.component').then(m => m.ProductDetailPageComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./view/pages/user/categories/categories/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: 'categories/:id',
    loadComponent: () =>
      import('./view/pages/user/products/products/product-listing.component').then(
        (m) => m.ProductListingComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./view/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
