import type {PaymentMethod} from '@/domain/entities/Payment';

export const paymentMethodsSeed: PaymentMethod[] = [
  {
    id: 'pm_client_1_card_1',
    userId: 'usr_client_1',
    type: 'CARD',
    alias: 'Visa Personal',
    last4: '4242',
    provider: 'VISA',
    isDefault: true,
  },
  {
    id: 'pm_client_1_cash',
    userId: 'usr_client_1',
    type: 'CASH',
    alias: 'Efectivo',
    isDefault: false,
  },
];
