export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  label: string;
  street: string;
  city: string;
  coordinates: Coordinates;
}

export type StopType = 'ORIGIN' | 'DESTINATION' | 'WAYPOINT';

export interface ReservationStop {
  id: string;
  type: StopType;
  address: Address;
  order: number;
}

export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Reservation {
  id: string;
  clientId: string;
  createdAt: string;
  scheduledAt: string;
  passengers: number;
  notes?: string;
  status: ReservationStatus;
  stops: ReservationStop[];
  estimatedDistanceKm: number;
  estimatedDurationMin: number;
  totalPrice: number;
  currency: 'USD';
  pricingRuleSnapshot: PricingRuleSnapshot;
}

export interface PricingRuleSnapshot {
  basePrice: number;
  pricePerKm: number;
  pricePerMinute: number;
  minimumFare: number;
  surgeMultiplier: number;
}
