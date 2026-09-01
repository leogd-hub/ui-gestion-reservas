import {create} from 'zustand';
import type {PaymentMethod} from '@/domain/entities/Payment';
import {services} from '@/infrastructure/mocks/container';
import {DomainError} from '@/shared/errors/DomainError';

interface PaymentActions {
  loadMethods: (userId: string) => Promise<void>;
  addMethod: (input: {
    userId: string;
    type: PaymentMethod['type'];
    alias: string;
    last4?: string;
    provider?: string;
  }) => Promise<void>;
  setDefault: (userId: string, paymentMethodId: string) => Promise<void>;
  clearError: () => void;
}

interface PaymentStore extends PaymentActions {
  methods: PaymentMethod[];
  loading: boolean;
  error: string | null;
}

const mapError = (error: unknown): string => {
  if (error instanceof DomainError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Error inesperado';
};

export const usePaymentStore = create<PaymentStore>(set => ({
  methods: [],
  loading: false,
  error: null,

  loadMethods: async userId => {
    set({loading: true, error: null});
    try {
      const methods = await services.paymentService.listPaymentMethods(userId);
      set({methods, loading: false});
    } catch (error) {
      set({loading: false, error: mapError(error)});
    }
  },

  addMethod: async input => {
    set({loading: true, error: null});
    try {
      const created = await services.paymentService.addPaymentMethod(input);
      set(state => ({
        loading: false,
        methods: [created, ...state.methods],
      }));
    } catch (error) {
      set({loading: false, error: mapError(error)});
    }
  },

  setDefault: async (userId, paymentMethodId) => {
    set({loading: true, error: null});
    try {
      const methods = await services.paymentService.setDefaultPaymentMethod(userId, paymentMethodId);
      set({methods, loading: false});
    } catch (error) {
      set({loading: false, error: mapError(error)});
    }
  },

  clearError: () => set({error: null}),
}));
