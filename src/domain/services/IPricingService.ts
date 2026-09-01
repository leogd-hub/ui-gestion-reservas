import type {PriceBreakdown, PricingRules} from '@/domain/entities/Pricing';
import type {PricingRuleSnapshot} from '@/domain/entities/Reservation';

export interface PriceEstimationInput {
  distanceKm: number;
  durationMin: number;
}

export interface IPricingService {
  estimatePrice(input: PriceEstimationInput): Promise<PriceBreakdown>;
  getRules(): Promise<PricingRules>;
  updateRules(rules: PricingRules): Promise<PricingRules>;
  getRuleSnapshot(): Promise<PricingRuleSnapshot>;
}
