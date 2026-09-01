import type {User} from '@/domain/entities/User';

export const usersSeed: User[] = [
  {
    id: 'usr_client_1',
    fullName: 'Client Demo',
    email: 'client@demo.com',
    role: 'CLIENT',
    phone: '+1 555 0101',
  },
  {
    id: 'usr_admin_1',
    fullName: 'Admin Demo',
    email: 'admin@demo.com',
    role: 'ADMIN',
    phone: '+1 555 0202',
  },
];
