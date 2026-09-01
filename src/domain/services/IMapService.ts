import type {Coordinates} from '@/domain/entities/Reservation';

export interface RouteEstimation {
  distanceKm: number;
  durationMin: number;
  polyline: string;
}

export interface SearchAddressResult {
  label: string;
  street: string;
  city: string;
  coordinates: Coordinates;
}

export interface IMapService {
  searchAddress(query: string): Promise<SearchAddressResult[]>;
  estimateRoute(stops: Coordinates[]): Promise<RouteEstimation>;
}
