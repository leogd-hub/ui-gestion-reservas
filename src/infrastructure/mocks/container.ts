import {MockAuthService} from '@/infrastructure/mocks/services/MockAuthService';
import {MockMapService} from '@/infrastructure/mocks/services/MockMapService';
import {MockPaymentService} from '@/infrastructure/mocks/services/MockPaymentService';
import {MockPricingService} from '@/infrastructure/mocks/services/MockPricingService';
import {MockReservationService} from '@/infrastructure/mocks/services/MockReservationService';

const pricingService = new MockPricingService();
const mapService = new MockMapService();
const paymentService = new MockPaymentService();
const authService = new MockAuthService();
const reservationService = new MockReservationService(pricingService, mapService);

export const services = {
  authService,
  pricingService,
  mapService,
  paymentService,
  reservationService,
};
