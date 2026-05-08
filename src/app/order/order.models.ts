export type OptionType = 'select_one' | 'select_multiple';

export interface ProductOptionValue {
  id: string;
  label: string;
}

export interface ProductOption {
  id: string;
  label: string;
  type: OptionType;
  required: boolean;
  values: ProductOptionValue[];
}

export interface ProductOptionsResponse {
  product_type: string;
  options: ProductOption[];
}

export interface OrderSelection {
  optionId: string;
  valueIds: string[];
}

export interface CartItem {
  id: string;
  productType: string;
  selections: Array<{ optionLabel: string; valueLabels: string[] }>;
  selectedOptions: OrderSelection[];
}

export interface PlaceOrderRequest {
  items: Array<{
    product_type: string;
    options: OrderSelection[];
  }>;
}

