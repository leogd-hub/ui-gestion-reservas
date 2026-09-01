import type {User} from '@/domain/entities/User';

export type SessionStatus = 'anonymous' | 'authenticated';

export interface SessionState {
  status: SessionStatus;
  user: User | null;
}
