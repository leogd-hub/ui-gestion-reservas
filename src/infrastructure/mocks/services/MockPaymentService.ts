import type {PaymentMethod, PaymentReceipt} from '@/domain/entities/Payment';
import type {
  CreatePaymentMethodInput,
  IPaymentMethodService,
  ITransactionService,
} from '@/domain/services/IPaymentService';
import {paymentMethodsSeed} from '@/infrastructure/mocks/data/paymentMethods';
import {MockAsyncRunner} from '@/infrastructure/mocks/utils/mockAsync';
import {DomainError} from '@/shared/errors/DomainError';
import {nowIso} from '@/shared/utils/date';
import {generateId} from '@/shared/utils/generateId';

export class MockPaymentService implements IPaymentMethodService, ITransactionService {
  private paymentMethods: PaymentMethod[] = [...paymentMethodsSeed];
  private receipts: PaymentReceipt[] = [];
  private readonly runner = new MockAsyncRunner({minMs: 200, maxMs: 650, failRate: 0.05});

  listPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return this.runner.run(() =>
      this.paymentMethods.filter(method => method.userId === userId).map(method => ({...method})),
    );
  }

  addPaymentMethod(input: CreatePaymentMethodInput): Promise<PaymentMethod> {
    return this.runner.run(() => {
      const hasDefault = this.paymentMethods.some(
        method => method.userId === input.userId && method.isDefault,
      );

      const method: PaymentMethod = {
        id: generateId('pm'),
        userId: input.userId,
        type: input.type,
        alias: input.alias,
        last4: input.last4,
        provider: input.provider,
        isDefault: !hasDefault,
      };

      this.paymentMethods.unshift(method);
      return {...method};
    });
  }

  setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<PaymentMethod[]> {
    return this.runner.run(() => {
      let found = false;

      this.paymentMethods = this.paymentMethods.map(method => {
        if (method.userId !== userId) {
          return method;
        }

        if (method.id === paymentMethodId) {
          found = true;
          return {...method, isDefault: true};
        }

        return {...method, isDefault: false};
      });

      if (!found) {
        throw new DomainError('Método de pago no encontrado', 'PAYMENT_METHOD_NOT_FOUND');
      }

      return this.paymentMethods.filter(method => method.userId === userId).map(method => ({...method}));
    });
  }

  processReservationPayment(params: {
    reservationId: string;
    userId: string;
    paymentMethodId: string;
    amount: number;
  }): Promise<PaymentReceipt> {
    return this.runner.run(() => {
      const paymentMethod = this.paymentMethods.find(
        method => method.id === params.paymentMethodId && method.userId === params.userId,
      );

      if (!paymentMethod) {
        throw new DomainError('No existe el método de pago seleccionado', 'PAYMENT_METHOD_NOT_FOUND');
      }

      const receipt: PaymentReceipt = {
        id: generateId('pay'),
        reservationId: params.reservationId,
        amount: Number(params.amount.toFixed(2)),
        currency: 'USD',
        status: 'PAID',
        createdAt: nowIso(),
      };

      this.receipts.unshift(receipt);
      return {...receipt};
    }, 'No se pudo procesar el pago (mock)');
  }
}
