import type {Reservation, ReservationStatus} from '@/domain/entities/Reservation';
import type {
  CreateReservationInput,
  IReservationService,
  ReservationFilters,
} from '@/domain/services/IReservationService';

export class CreateReservationUseCase {
  constructor(private readonly reservationService: IReservationService) {}

  execute(input: CreateReservationInput): Promise<Reservation> {
    return this.reservationService.createReservation(input);
  }
}

export class GetReservationByIdUseCase {
  constructor(private readonly reservationService: IReservationService) {}

  execute(reservationId: string): Promise<Reservation | null> {
    return this.reservationService.getReservationById(reservationId);
  }
}

export class GetReservationsUseCase {
  constructor(private readonly reservationService: IReservationService) {}

  execute(filters?: ReservationFilters): Promise<Reservation[]> {
    return this.reservationService.getReservations(filters);
  }
}

export class UpdateReservationStatusUseCase {
  constructor(private readonly reservationService: IReservationService) {}

  execute(reservationId: string, status: ReservationStatus): Promise<Reservation> {
    return this.reservationService.updateReservationStatus(reservationId, status);
  }
}
