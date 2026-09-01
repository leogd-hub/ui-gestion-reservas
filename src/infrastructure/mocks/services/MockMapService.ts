import type {Address, Coordinates} from '@/domain/entities/Reservation';
import type {IMapService, RouteEstimation, SearchAddressResult} from '@/domain/services/IMapService';
import {addressesSeed} from '@/infrastructure/mocks/data/addresses';
import {MockAsyncRunner} from '@/infrastructure/mocks/utils/mockAsync';

const toRad = (value: number): number => (value * Math.PI) / 180;

const haversineDistanceKm = (from: Coordinates, to: Coordinates): number => {
  const earthRadiusKm = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

export class MockMapService implements IMapService {
  private readonly addresses: Address[] = [...addressesSeed];
  private readonly runner = new MockAsyncRunner({minMs: 140, maxMs: 420, failRate: 0.01});

  searchAddress(query: string): Promise<SearchAddressResult[]> {
    return this.runner.run(() => {
      const normalized = query.trim().toLowerCase();
      if (!normalized) {
        return [];
      }

      return this.addresses
        .filter(
          address =>
            address.label.toLowerCase().includes(normalized) ||
            address.street.toLowerCase().includes(normalized) ||
            address.city.toLowerCase().includes(normalized),
        )
        .slice(0, 8)
        .map(address => ({...address}));
    });
  }

  estimateRoute(stops: Coordinates[]): Promise<RouteEstimation> {
    return this.runner.run(() => {
      if (stops.length < 2) {
        return {
          distanceKm: 0,
          durationMin: 0,
          polyline: JSON.stringify(stops),
        };
      }

      let totalDistanceKm = 0;
      for (let index = 1; index < stops.length; index += 1) {
        totalDistanceKm += haversineDistanceKm(stops[index - 1], stops[index]);
      }

      const roundedDistance = Number(totalDistanceKm.toFixed(2));
      const avgSpeedKmH = 28;
      const durationMin = Number(((roundedDistance / avgSpeedKmH) * 60).toFixed(0));

      return {
        distanceKm: roundedDistance,
        durationMin,
        polyline: JSON.stringify(stops),
      };
    });
  }
}
