import { catchError, Observable, tap } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import { AUTH_SERVICE } from '@projects/constants/services'
import { addToContext, getAuthFromContext } from '@app/common'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authenticationString = getAuthFromContext(context)

    return this.authClient
      .send('validate_user', {
        jwt: authenticationString?.split(' ')[1],
      })
      .pipe(
        tap((userId) => addToContext('userId', userId, context)),
        catchError(() => {
          throw new UnauthorizedException()
        }),
      )
  }
}

