export interface PricingRules {
  basePrice: number;
  pricePerKm: number;
  pricePerMinute: number;
  minimumFare: number;
  surgeMultiplier: number;
}

export interface PriceBreakdown {
  basePrice: number;
  distanceCost: number;
  timeCost: number;
  subtotal: number;
  surgeMultiplier: number;
  total: number;
  currency: 'USD';
}
