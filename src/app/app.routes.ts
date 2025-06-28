import { Routes } from '@angular/router';
import { CartComponent } from './view/pages/user/cart/cart.component';
import { authGuard } from './core/guards/auth.guard';
import { UserRole } from './core/interfaces/user.interface';
import { HomeComponent } from './components/home/home.component'

export const routes: Routes = [
    {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  // {
  //   path: '',
  //   redirectTo: 'my-account',
  //   pathMatch: 'full',
  // },
  {
    path: 'cart',
    loadComponent: () =>
      import('./view/pages/user/cart/cart.component').then(
        (m) => m.CartComponent
      ),
    canActivate: [authGuard(UserRole.User)],
  },
  {
    path: 'success',
    loadComponent: () =>
      import('./view/pages/user/success/success.component').then(
        (m) => m.SuccessComponent
      ),
  },
  {
    path: 'cancel',
    loadComponent: () =>
      import('./view/pages/user/cancel/cancel.component').then(
        (m) => m.CancelComponent
      ),
  },

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
      import(
        './view/pages/auth/forgot-password/forgot-password.component'
      ).then((m) => m.ForgotPasswordComponent),
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
        redirectTo: 'orders',
        pathMatch: 'full',
      },
      {
        path: 'orders',
        loadComponent: () =>
          import(
            './view/pages/user/my-account/pages/user-orders/user-orders.component'
          ).then((m) => m.UserOrdersComponent),
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
      {
        path: '',
        pathMatch: 'full',

        loadComponent: () =>
          import('./view/pages/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        data: { title: 'Dashboard' },
      },
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
    loadComponent: () =>
      import(
        './view/pages/user/products/products/product-listing.component'
      ).then((m) => m.ProductListingComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import(
        './view/pages/user/products/product-detail/product-detail-page.component'
      ).then((m) => m.ProductDetailPageComponent),
  },
    {
    path: 'wishlist',
    loadComponent: () =>
      import('./view/pages/user/products/wishlist/wishlist.component').then(
        (m) => m.WishlistComponent
      ),
    canActivate: [authGuard(UserRole.User)],
  },
  {
    path: 'categories',
    loadComponent: () =>
      import(
        './view/pages/user/categories/categories/categories.component'
      ).then((m) => m.CategoriesComponent),
  },
  {
    path: 'categories/:id',
    loadComponent: () =>
      import(
        './view/pages/user/products/products/product-listing.component'
      ).then((m) => m.ProductListingComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./view/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  // Add your routes here
];
