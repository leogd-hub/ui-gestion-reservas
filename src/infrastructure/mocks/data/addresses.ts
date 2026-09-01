import type {Address} from '@/domain/entities/Reservation';

export const addressesSeed: Address[] = [
  {
    label: 'Downtown Plaza',
    street: '100 Main St',
    city: 'Metropolis',
    coordinates: {lat: -34.6037, lng: -58.3816},
  },
  {
    label: 'Central Station',
    street: '250 Rail Ave',
    city: 'Metropolis',
    coordinates: {lat: -34.608, lng: -58.3703},
  },
  {
    label: 'Airport Terminal A',
    street: '1 Skyway Rd',
    city: 'Metropolis',
    coordinates: {lat: -34.8222, lng: -58.5358},
  },
];
