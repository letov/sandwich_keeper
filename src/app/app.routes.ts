import { Routes } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { SandwichMakerComponent } from './sandwich-maker/sandwich-maker.component';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'order' },
  { path: 'order', component: OrderComponent },
  { path: 'sandwich_maker', component: SandwichMakerComponent },
  { path: '**', redirectTo: 'order' },
];

