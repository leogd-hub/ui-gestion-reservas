import {create} from 'zustand';
import type {SessionState} from './types';
import {services} from '@/infrastructure/mocks/container';
import type {LoginInput, RegisterInput} from '@/domain/services/IAuthService';
import {DomainError} from '@/shared/errors/DomainError';

interface SessionActions {
  bootstrap: () => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface SessionStore extends SessionState, SessionActions {
  loading: boolean;
  error: string | null;
}

const initialState: Pick<SessionStore, 'status' | 'user' | 'loading' | 'error'> = {
  status: 'anonymous',
  user: null,
  loading: false,
  error: null,
};

const mapError = (error: unknown): string => {
  if (error instanceof DomainError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado';
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  ...initialState,

  bootstrap: async () => {
    set({loading: true, error: null});
    try {
      const user = await services.authService.getCurrentUser();
      set({
        user,
        status: user ? 'authenticated' : 'anonymous',
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: mapError(error),
        status: 'anonymous',
        user: null,
      });
    }
  },

  login: async input => {
    set({loading: true, error: null});
    try {
      const user = await services.authService.login(input);
      set({
        user,
        status: 'authenticated',
        loading: false,
      });
    } catch (error) {
      set({loading: false, error: mapError(error)});
    }
  },

  register: async input => {
    set({loading: true, error: null});
    try {
      const user = await services.authService.register(input);
      set({
        user,
        status: 'authenticated',
        loading: false,
      });
    } catch (error) {
      set({loading: false, error: mapError(error)});
    }
  },

  logout: async () => {
    const currentUser = get().user;

    set({loading: true, error: null});
    try {
      if (currentUser) {
        await services.authService.logout(currentUser.id);
      }

      set({
        ...initialState,
      });
    } catch (error) {
      set({loading: false, error: mapError(error)});
    }
  },

  clearError: () => set({error: null}),
}));
