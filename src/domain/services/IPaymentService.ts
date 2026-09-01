import type {PaymentMethod, PaymentReceipt} from '@/domain/entities/Payment';

export interface CreatePaymentMethodInput {
  userId: string;
  type: PaymentMethod['type'];
  alias: string;
  last4?: string;
  provider?: string;
}

export interface ITransactionService {
  processReservationPayment(params: {
    reservationId: string;
    userId: string;
    paymentMethodId: string;
    amount: number;
  }): Promise<PaymentReceipt>;
}

export interface IPaymentMethodService {
  listPaymentMethods(userId: string): Promise<PaymentMethod[]>;
  addPaymentMethod(input: CreatePaymentMethodInput): Promise<PaymentMethod>;
  setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<PaymentMethod[]>;
}
