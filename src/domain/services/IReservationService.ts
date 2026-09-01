import type {Reservation, ReservationStatus, ReservationStop} from '@/domain/entities/Reservation';

export interface CreateReservationInput {
  clientId: string;
  scheduledAt: string;
  passengers: number;
  notes?: string;
  stops: ReservationStop[];
}

export interface ReservationFilters {
  clientId?: string;
  status?: ReservationStatus;
}

export interface IReservationService {
  createReservation(input: CreateReservationInput): Promise<Reservation>;
  getReservationById(reservationId: string): Promise<Reservation | null>;
  getReservations(filters?: ReservationFilters): Promise<Reservation[]>;
  updateReservationStatus(reservationId: string, status: ReservationStatus): Promise<Reservation>;
}
