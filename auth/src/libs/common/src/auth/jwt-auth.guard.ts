import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

import { catchError, map, tap } from 'rxjs/operators';
import { AUTH_SERVICE } from '@/libs/common/src/constants/service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest()?.Authentication ||
      context.switchToHttp().getRequest().headers?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication || // <-- minúscula
      context.switchToHttp().getRequest().headers?.authorization?.split(' ')[1] || // <-- formato Bearer
      context.switchToHttp().getRequest().Authentication || // fallback
      context.switchToHttp().getRequest().headers?.['x-test-auth']; // <-- para testes
      console.log('jwt', jwt);

    if (!jwt) {
      return false;
    }

    return this.authClient
      .send('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }
}
