import type {PricingRules} from '@/domain/entities/Pricing';

export const pricingRulesSeed: PricingRules = {
  basePrice: 4,
  pricePerKm: 1.7,
  pricePerMinute: 0.35,
  minimumFare: 8,
  surgeMultiplier: 1,
};
