import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from '../../supabase/supabase.service';

export type AuthenticatedRequest = Request & { user: User };

@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const match = request.headers.authorization?.match(/^Bearer (\S+)$/i);
    if (!match) throw new UnauthorizedException('Войдите в аккаунт.');
    const { data, error } = await this.supabase
      .getClient()
      .auth.getUser(match[1]);
    if (error || !data.user) {
      throw new UnauthorizedException('Сессия истекла. Войдите снова.');
    }
    request.user = data.user;
    return true;
  }
}
