import type {PriceBreakdown, PricingRules} from '@/domain/entities/Pricing';
import type {PricingRuleSnapshot} from '@/domain/entities/Reservation';
import type {IPricingService, PriceEstimationInput} from '@/domain/services/IPricingService';
import {pricingRulesSeed} from '@/infrastructure/mocks/data/pricing';
import {MockAsyncRunner} from '@/infrastructure/mocks/utils/mockAsync';
import {DomainError} from '@/shared/errors/DomainError';

export class MockPricingService implements IPricingService {
  private rules: PricingRules = {...pricingRulesSeed};
  private readonly runner = new MockAsyncRunner({minMs: 120, maxMs: 380, failRate: 0.02});

  estimatePrice(input: PriceEstimationInput): Promise<PriceBreakdown> {
    return this.runner.run(() => {
      if (input.distanceKm < 0 || input.durationMin < 0) {
        throw new DomainError('Distancia y duración deben ser valores positivos', 'PRICING_INVALID');
      }

      const basePrice = this.rules.basePrice;
      const distanceCost = Number((input.distanceKm * this.rules.pricePerKm).toFixed(2));
      const timeCost = Number((input.durationMin * this.rules.pricePerMinute).toFixed(2));
      const subtotal = Number((basePrice + distanceCost + timeCost).toFixed(2));
      const surged = Number((subtotal * this.rules.surgeMultiplier).toFixed(2));
      const total = Math.max(this.rules.minimumFare, surged);

      return {
        basePrice,
        distanceCost,
        timeCost,
        subtotal,
        surgeMultiplier: this.rules.surgeMultiplier,
        total: Number(total.toFixed(2)),
        currency: 'USD',
      };
    });
  }

  getRules(): Promise<PricingRules> {
    return this.runner.run(() => ({...this.rules}));
  }

  updateRules(rules: PricingRules): Promise<PricingRules> {
    return this.runner.run(() => {
      this.rules = {...rules};
      return {...this.rules};
    }, 'No se pudo actualizar pricing rules (mock)');
  }

  getRuleSnapshot(): Promise<PricingRuleSnapshot> {
    return this.runner.run(() => ({...this.rules}));
  }
}
