import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Types } from 'mongoose'

import { User } from '@users/schemas/user.schema'

export interface TokenPayload {
  userId: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User) {
    try {
      const tokenPayload: TokenPayload = {
        userId: user._id.toHexString(),
      }
      const expires = new Date()
      const expitesInSeconds = this.configService.get('JWT_EXP')

      expires.setSeconds(expires.getSeconds() + expitesInSeconds)

      const token = this.jwtService.sign(tokenPayload)

      return { token, user: user }
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }
  }

  validateToken(jwt: string) {
    return this.jwtService.verify<{ userId }>(jwt)
  }
}

