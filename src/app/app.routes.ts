import { Routes } from '@angular/router';
import { OrderComponent } from './order/order.component';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'order' },
  { path: 'order', component: OrderComponent },
  { path: '**', redirectTo: 'order' },
];

