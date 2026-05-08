import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { OrderApiService } from '../order/order-api.service';
import { OrderStatus, RecentOrder } from '../order/order.models';

@Component({
  selector: 'app-sandwich-maker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sandwich-maker.component.html',
  styleUrl: './sandwich-maker.component.css',
})
export class SandwichMakerComponent implements OnInit {
  loading = true;
  loadError = '';
  orders: RecentOrder[] = [];

  readonly maxCards = 6;

  constructor(private readonly orderApi: OrderApiService) {}

  ngOnInit(): void {
    this.fetchRecentOrders();
  }

  fetchRecentOrders(): void {
    this.loading = true;
    this.loadError = '';
    this.orderApi
      .getRecentOrders(5)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (orders) => {
          this.orders = orders;
        },
        error: () => {
          this.loadError = 'Failed to load recent orders.';
        },
      });
  }

  getCardSlots(): Array<RecentOrder | null> {
    const slots: Array<RecentOrder | null> = [...this.orders];
    while (slots.length < this.maxCards) {
      slots.push(null);
    }
    return slots.slice(0, this.maxCards);
  }

  nextStatus(status: OrderStatus): OrderStatus | null {
    if (status === 'New') return 'In Progress';
    if (status === 'In Progress') return 'Ready';
    return null;
  }

  nextStatusLabel(status: OrderStatus): string {
    if (status === 'New') return 'Move to In Progress';
    if (status === 'In Progress') return 'Move to Ready';
    return 'No action';
  }

  moveToNextStatus(orderNumber: number): void {
    this.orders = this.orders.map((order) => {
      if (order.order_number !== orderNumber) return order;
      const next = this.nextStatus(order.status);
      return next ? { ...order, status: next } : order;
    });
  }

  formatSelectionValue(value: string | string[]): string {
    return Array.isArray(value) ? (value.length ? value.join(', ') : '-') : value;
  }

  selectionEntries(selections: Record<string, string | string[]>): Array<[string, string | string[]]> {
    return Object.entries(selections);
  }

  trackByOrder(_: number, order: RecentOrder | null): number | string {
    return order ? order.order_number : `empty-${_}`;
  }
}

