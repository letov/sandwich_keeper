import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { OrderApiService } from './order-api.service';
import {
  CartItem,
  PlaceOrderRequest,
  ProductOption,
  ProductOptionsResponse,
} from './order.models';

type OrderFormControls = Record<string, FormControl<string | string[] | null>>;

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  readonly productType = 'sandwich';

  loading = true;
  loadError = '';
  orderMessage = '';

  options: ProductOption[] = [];
  form = new FormGroup<OrderFormControls>({});
  cart: CartItem[] = [];

  constructor(private readonly orderApi: OrderApiService) {}

  ngOnInit(): void {
    this.fetchOptions();
  }

  fetchOptions(): void {
    this.loading = true;
    this.loadError = '';
    this.orderApi
      .getProductOptions(this.productType)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => this.setupFromResponse(response),
        error: () => {
          this.loadError = 'Failed to load product options. Try again.';
        },
      });
  }

  addToCart(): void {
    if (!this.isFormValid()) {
      this.orderMessage = 'Please select all required options.';
      return;
    }

    const item: CartItem = {
      id: crypto.randomUUID(),
      productType: this.productType,
      selections: this.options.map((option) => ({
        optionLabel: option.label,
        valueLabels: this.getSelectedValueLabels(option),
      })),
      selectedOptions: this.options.map((option) => ({
        optionId: option.id,
        valueIds: this.getSelectedIds(option),
      })),
    };

    this.cart = [...this.cart, item];
    this.orderMessage = 'Product added to cart.';
    this.resetForm();
  }

  removeFromCart(itemId: string): void {
    this.cart = this.cart.filter((item) => item.id !== itemId);
    this.orderMessage = '';
  }

  placeOrder(): void {
    if (!this.cart.length) {
      this.orderMessage = 'Cart is empty.';
      return;
    }

    const payload: PlaceOrderRequest = {
      items: this.cart.map((item) => ({
        product_type: item.productType,
        options: item.selectedOptions,
      })),
    };

    this.orderApi.placeOrder(payload).subscribe({
      next: () => {
        this.cart = [];
        this.orderMessage = 'Order sent successfully.';
      },
      error: () => {
        this.orderMessage = 'Failed to send order.';
      },
    });
  }

  cancelOrder(): void {
    this.cart = [];
    this.resetForm();
    this.orderMessage = 'Order cancelled.';
  }

  onMultiToggle(option: ProductOption, valueId: string, checked: boolean): void {
    const control = this.form.controls[option.id];
    const current = (control?.value as string[] | null) ?? [];
    const next = checked
      ? [...current, valueId]
      : current.filter((id) => id !== valueId);
    control?.setValue(next);
  }

  isMultiChecked(option: ProductOption, valueId: string): boolean {
    const selected = (this.form.controls[option.id]?.value as string[] | null) ?? [];
    return selected.includes(valueId);
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  private setupFromResponse(response: ProductOptionsResponse): void {
    this.options = response.options ?? [];
    const controls: OrderFormControls = {};
    for (const option of this.options) {
      controls[option.id] = new FormControl<string | string[] | null>(
        option.type === 'select_multiple' ? [] : null,
      );
    }
    this.form = new FormGroup<OrderFormControls>(controls);
  }

  private getSelectedValueLabels(option: ProductOption): string[] {
    const value = this.form.controls[option.id]?.value;
    if (option.type === 'select_one') {
      if (!value || typeof value !== 'string') return [];
      const found = option.values.find((v) => v.id === value);
      return found ? [found.label] : [];
    }
    const selected = Array.isArray(value) ? value : [];
    return option.values
      .filter((v) => selected.includes(v.id))
      .map((v) => v.label);
  }

  private getSelectedIds(option: ProductOption): string[] {
    const value = this.form.controls[option.id]?.value;
    if (option.type === 'select_one') {
      return typeof value === 'string' ? [value] : [];
    }
    return Array.isArray(value) ? value : [];
  }

  private isFormValid(): boolean {
    return this.options.every((option) => {
      const selected = this.getSelectedIds(option);
      return option.required ? selected.length > 0 : true;
    });
  }

  private resetForm(): void {
    for (const option of this.options) {
      this.form.controls[option.id]?.setValue(
        option.type === 'select_multiple' ? [] : null,
      );
    }
  }
}

