import type {PriceBreakdown, PricingRules} from '@/domain/entities/Pricing';
import type {IPricingService, PriceEstimationInput} from '@/domain/services/IPricingService';

export class CalculatePriceUseCase {
  constructor(private readonly pricingService: IPricingService) {}

  execute(input: PriceEstimationInput): Promise<PriceBreakdown> {
    return this.pricingService.estimatePrice(input);
  }
}

export class GetPricingRulesUseCase {
  constructor(private readonly pricingService: IPricingService) {}

  execute(): Promise<PricingRules> {
    return this.pricingService.getRules();
  }
}

export class UpdatePricingRulesUseCase {
  constructor(private readonly pricingService: IPricingService) {}

  execute(rules: PricingRules): Promise<PricingRules> {
    return this.pricingService.updateRules(rules);
  }
}
