import {create} from 'zustand';
import type {Reservation, ReservationStatus, ReservationStop} from '@/domain/entities/Reservation';
import {services} from '@/infrastructure/mocks/container';
import type {Address} from '@/domain/entities/Reservation';
import {DomainError} from '@/shared/errors/DomainError';

export interface ReservationDraft {
  scheduledAt: string;
  passengers: number;
  notes?: string;
  stops: ReservationStop[];
}

interface ReservationActions {
  setDraftMeta: (payload: {
    scheduledAt?: string;
    passengers?: number;
    notes?: string;
  }) => void;
  addStop: (address: Address, type: ReservationStop['type']) => void;
  removeStop: (stopId: string) => void;
  clearDraft: () => void;
  createReservation: (clientId: string) => Promise<Reservation | null>;
  loadReservations: (clientId?: string) => Promise<void>;
  updateStatus: (reservationId: string, status: ReservationStatus) => Promise<void>;
  clearError: () => void;
}

interface ReservationStore extends ReservationActions {
  draft: ReservationDraft;
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
}

const defaultDraft: ReservationDraft = {
  scheduledAt: '',
  passengers: 1,
  notes: '',
  stops: [],
};

const mapError = (error: unknown): string => {
  if (error instanceof DomainError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Error inesperado';
};

export const useReservationStore = create<ReservationStore>((set, get) => ({
  draft: {...defaultDraft},
  reservations: [],
  loading: false,
  error: null,

  setDraftMeta: payload => {
    set(state => ({
      draft: {
        ...state.draft,
        ...payload,
      },
    }));
  },

  addStop: (address, type) => {
    set(state => {
      const nextOrder = state.draft.stops.length + 1;
      return {
        draft: {
          ...state.draft,
          stops: [
            ...state.draft.stops,
            {
              id: `stop_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              type,
              address,
              order: nextOrder,
            },
          ],
        },
      };
    });
  },

  removeStop: stopId => {
    set(state => ({
      draft: {
        ...state.draft,
        stops: state.draft.stops
          .filter(stop => stop.id !== stopId)
          .map((stop, index) => ({...stop, order: index + 1})),
      },
    }));
  },

  clearDraft: () => {
    set({draft: {...defaultDraft}});
  },

  createReservation: async clientId => {
    const {draft} = get();

    set({loading: true, error: null});
    try {
      const created = await services.reservationService.createReservation({
        clientId,
        scheduledAt: draft.scheduledAt,
        passengers: draft.passengers,
        notes: draft.notes,
        stops: draft.stops,
      });

      set(state => ({
        loading: false,
        draft: {...defaultDraft},
        reservations: [created, ...state.reservations],
      }));

      return created;
    } catch (error) {
      set({loading: false, error: mapError(error)});
      return null;
    }
  },

  loadReservations: async clientId => {
    set({loading: true, error: null});
    try {
      const reservations = await services.reservationService.getReservations(
        clientId ? {clientId} : undefined,
      );
      set({reservations, loading: false});
    } catch (error) {
      set({loading: false, error: mapError(error)});
    }
  },

  updateStatus: async (reservationId, status) => {
    set({loading: true, error: null});
    try {
      const updated = await services.reservationService.updateReservationStatus(reservationId, status);
      set(state => ({
        loading: false,
        reservations: state.reservations.map(item =>
          item.id === updated.id ? updated : item,
        ),
      }));
    } catch (error) {
      set({loading: false, error: mapError(error)});
    }
  },

  clearError: () => set({error: null}),
}));
