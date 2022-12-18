import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import { AuthService } from '@users/auth.service'
import { UsersService } from '@users/users.service'
import { sanitizeUser } from '@users/helpers/sanitize-user'
import { addToContext, getAuthFromContext, UserId } from '@app/common'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticationString = getAuthFromContext(context)

    try {
      const { userId } = this.authService.validateToken(
        authenticationString?.split(' ')[1],
      )

      const user = await this.usersService.getUser({ _id: userId })

      addToContext('user', user, context)

      return true
    } catch (e) {
      throw new UnauthorizedException(e)
    }
  }
}

