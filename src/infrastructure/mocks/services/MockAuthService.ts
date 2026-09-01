import type {IAuthService, LoginInput, RegisterInput} from '@/domain/services/IAuthService';
import type {User} from '@/domain/entities/User';
import {DomainError} from '@/shared/errors/DomainError';
import {generateId} from '@/shared/utils/generateId';
import {usersSeed} from '@/infrastructure/mocks/data/users';
import {MockAsyncRunner} from '@/infrastructure/mocks/utils/mockAsync';

export class MockAuthService implements IAuthService {
  private users: User[] = [...usersSeed];
  private currentUser: User | null = null;
  private readonly runner = new MockAsyncRunner({minMs: 180, maxMs: 550, failRate: 0.03});

  login(input: LoginInput): Promise<User> {
    return this.runner.run(() => {
      const found = this.users.find(
        user => user.email.toLowerCase() === input.email.toLowerCase() && user.role === input.role,
      );

      if (!found) {
        throw new DomainError('Credenciales inválidas para el rol seleccionado', 'AUTH_INVALID');
      }

      this.currentUser = found;
      return found;
    }, 'No se pudo iniciar sesión (mock)');
  }

  register(input: RegisterInput): Promise<User> {
    return this.runner.run(() => {
      const exists = this.users.some(user => user.email.toLowerCase() === input.email.toLowerCase());
      if (exists) {
        throw new DomainError('El email ya está registrado', 'AUTH_EMAIL_EXISTS');
      }

      const user: User = {
        id: generateId('usr'),
        fullName: input.fullName,
        email: input.email,
        role: input.role,
      };

      this.users.unshift(user);
      this.currentUser = user;

      return user;
    }, 'No se pudo registrar el usuario (mock)');
  }

  logout(_userId: string): Promise<void> {
    return this.runner.run(() => {
      this.currentUser = null;
    });
  }

  getCurrentUser(): Promise<User | null> {
    return this.runner.run(() => this.currentUser);
  }
}
