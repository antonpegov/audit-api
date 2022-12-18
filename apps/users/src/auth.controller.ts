import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { MessagePattern } from '@nestjs/microservices'

import { User } from '@users/schemas/user.schema'
import { UserId } from '@app/common'
import { AuthService } from '@users/auth.service'
import { CurrentUser } from '@users/decorators/current-user.decorator'
import { LoginRequest } from '@users/dto/login.request'
import { sanitizeUser } from '@users/helpers/sanitize-user'
import { JwtAuthGuard } from '@users/guards/jwt-auth.guard'
import { LoginResponse } from '@users/dto/login.response'
import { LocalAuthGuard } from '@users/guards/local-auth.guard'

const apiTag = 'auth'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiTags(apiTag)
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ type: LoginResponse })
  async login(
    @Body() req: LoginRequest,
    @CurrentUser() user: User,
  ): Promise<LoginResponse> {
    return this.authService.login(user).then((data) => ({
      ...data,
      user: sanitizeUser(data.user),
    }))
  }

  @Post('restore')
  @ApiTags(apiTag)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: LoginResponse })
  async restore(@CurrentUser() user: User): Promise<LoginResponse> {
    return this.authService.login(user).then((data) => ({
      ...data,
      user: sanitizeUser(data.user),
    }))
  }

  @MessagePattern('validate_user')
  async validateUser(data) {
    console.log('validateUserByData:', data)
    try {
      const { userId } = this.authService.validateToken(data.jwt)

      return userId
    } catch (e) {
      return null
    }
  }
}

