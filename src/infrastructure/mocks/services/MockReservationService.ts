import type {
  CreateReservationInput,
  IReservationService,
  ReservationFilters,
} from '@/domain/services/IReservationService';
import type {IPricingService} from '@/domain/services/IPricingService';
import type {IMapService} from '@/domain/services/IMapService';
import type {Reservation, ReservationStatus} from '@/domain/entities/Reservation';
import {MockAsyncRunner} from '@/infrastructure/mocks/utils/mockAsync';
import {generateId} from '@/shared/utils/generateId';
import {nowIso} from '@/shared/utils/date';
import {DomainError} from '@/shared/errors/DomainError';

export class MockReservationService implements IReservationService {
  private reservations: Reservation[] = [];
  private readonly runner = new MockAsyncRunner({minMs: 220, maxMs: 700, failRate: 0.04});

  constructor(
    private readonly pricingService: IPricingService,
    private readonly mapService: IMapService,
  ) {}

  async createReservation(input: CreateReservationInput): Promise<Reservation> {
    const route = await this.mapService.estimateRoute(input.stops.map(stop => stop.address.coordinates));
    const price = await this.pricingService.estimatePrice({
      distanceKm: route.distanceKm,
      durationMin: route.durationMin,
    });
    const pricingSnapshot = await this.pricingService.getRuleSnapshot();

    return this.runner.run(() => {
      if (input.stops.length < 2) {
        throw new DomainError('La reserva debe tener origen y destino', 'RESERVATION_INVALID_STOPS');
      }

      const reservation: Reservation = {
        id: generateId('res'),
        clientId: input.clientId,
        createdAt: nowIso(),
        scheduledAt: input.scheduledAt,
        passengers: input.passengers,
        notes: input.notes,
        status: 'PENDING',
        stops: input.stops,
        estimatedDistanceKm: route.distanceKm,
        estimatedDurationMin: route.durationMin,
        totalPrice: price.total,
        currency: 'USD',
        pricingRuleSnapshot: pricingSnapshot,
      };

      this.reservations.unshift(reservation);
      return {...reservation, stops: [...reservation.stops]};
    }, 'No se pudo crear la reserva (mock)');
  }

  getReservationById(reservationId: string): Promise<Reservation | null> {
    return this.runner.run(() => {
      const reservation = this.reservations.find(item => item.id === reservationId);
      return reservation ? {...reservation, stops: [...reservation.stops]} : null;
    });
  }

  getReservations(filters?: ReservationFilters): Promise<Reservation[]> {
    return this.runner.run(() => {
      let result = [...this.reservations];

      if (filters?.clientId) {
        result = result.filter(reservation => reservation.clientId === filters.clientId);
      }

      if (filters?.status) {
        result = result.filter(reservation => reservation.status === filters.status);
      }

      return result.map(item => ({...item, stops: [...item.stops]}));
    });
  }

  updateReservationStatus(reservationId: string, status: ReservationStatus): Promise<Reservation> {
    return this.runner.run(() => {
      const index = this.reservations.findIndex(item => item.id === reservationId);
      if (index < 0) {
        throw new DomainError('Reserva no encontrada', 'RESERVATION_NOT_FOUND');
      }

      const updated: Reservation = {
        ...this.reservations[index],
        status,
      };

      this.reservations[index] = updated;
      return {...updated, stops: [...updated.stops]};
    }, 'No se pudo actualizar el estado de la reserva (mock)');
  }
}
