import type {User, UserRole} from '@/domain/entities/User';

export interface LoginInput {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface IAuthService {
  login(input: LoginInput): Promise<User>;
  register(input: RegisterInput): Promise<User>;
  logout(userId: string): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
