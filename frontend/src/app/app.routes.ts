import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/products/products').then(m => m.ProductsComponent)
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout-component/checkout-component').then(m => m.CheckoutComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard-component/dashboard-component').then(m => m.DashboardComponent)
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./pages/order-status-component/order-status-component').then(m => m.OrderStatusComponent)
  },
  { path: '**', redirectTo: '' }
];
