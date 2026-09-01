import type {IAuthService, LoginInput, RegisterInput} from '@/domain/services/IAuthService';
import type {User} from '@/domain/entities/User';

export class LoginUseCase {
  constructor(private readonly authService: IAuthService) {}

  execute(input: LoginInput): Promise<User> {
    return this.authService.login(input);
  }
}

export class RegisterUseCase {
  constructor(private readonly authService: IAuthService) {}

  execute(input: RegisterInput): Promise<User> {
    return this.authService.register(input);
  }
}

export class LogoutUseCase {
  constructor(private readonly authService: IAuthService) {}

  execute(userId: string): Promise<void> {
    return this.authService.logout(userId);
  }
}
