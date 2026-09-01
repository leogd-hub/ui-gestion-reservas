export type PaymentMethodType = 'CARD' | 'CASH' | 'WALLET';

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  alias: string;
  last4?: string;
  provider?: string;
  isDefault: boolean;
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface PaymentReceipt {
  id: string;
  reservationId: string;
  amount: number;
  currency: 'USD';
  status: PaymentStatus;
  createdAt: string;
}
