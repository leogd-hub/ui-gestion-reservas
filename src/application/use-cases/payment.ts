import type {PaymentMethod, PaymentReceipt} from '@/domain/entities/Payment';
import type {
  CreatePaymentMethodInput,
  IPaymentMethodService,
  ITransactionService,
} from '@/domain/services/IPaymentService';

export class ProcessReservationPaymentUseCase {
  constructor(private readonly transactionService: ITransactionService) {}

  execute(params: {
    reservationId: string;
    userId: string;
    paymentMethodId: string;
    amount: number;
  }): Promise<PaymentReceipt> {
    return this.transactionService.processReservationPayment(params);
  }
}

export class ListPaymentMethodsUseCase {
  constructor(private readonly paymentMethodService: IPaymentMethodService) {}

  execute(userId: string): Promise<PaymentMethod[]> {
    return this.paymentMethodService.listPaymentMethods(userId);
  }
}

export class AddPaymentMethodUseCase {
  constructor(private readonly paymentMethodService: IPaymentMethodService) {}

  execute(input: CreatePaymentMethodInput): Promise<PaymentMethod> {
    return this.paymentMethodService.addPaymentMethod(input);
  }
}
