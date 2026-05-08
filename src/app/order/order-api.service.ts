import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PlaceOrderRequest, ProductOptionsResponse } from './order.models';
// import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  // constructor(private readonly http: HttpClient) {}

  getProductOptions(type: string): Observable<ProductOptionsResponse> {
    // return this.http.get<ProductOptionsResponse>(
    //   `/api/v1/products/options?type=${encodeURIComponent(type)}`,
    // );

    // Temporary mock response from the task description.
    // Replace with backend call when API is ready.
    return of({
      product_type: type,
      options: [
        {
          id: 'bread',
          label: 'Bread',
          type: 'select_one',
          required: true,
          values: [
            { id: 'white', label: 'White' },
            { id: 'wheat', label: 'Wheat' },
          ],
        },
        {
          id: 'filling',
          label: 'Filling',
          type: 'select_multiple',
          required: true,
          values: [
            { id: 'ham', label: 'Ham' },
            { id: 'cheese', label: 'Cheese' },
            { id: 'chicken', label: 'Chicken' },
          ],
        },
        {
          id: 'sauces',
          label: 'Sauces',
          type: 'select_multiple',
          required: false,
          values: [
            { id: 'mayo', label: 'Mayo' },
            { id: 'bbq', label: 'BBQ' },
          ],
        },
        {
          id: 'toasted',
          label: 'Toasted?',
          type: 'select_one',
          required: true,
          values: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
          ],
        },
      ],
    });
  }

  placeOrder(payload: PlaceOrderRequest): Observable<{ status: 'ok' }> {
    // return this.http.post<{ status: 'ok' }>('/api/v1/orders', payload);

    // Temporary mock response while POST is disabled by request.
    return of({ status: 'ok' });
  }
}

