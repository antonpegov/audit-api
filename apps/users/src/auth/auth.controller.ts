import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'

import { User } from '@users/schemas/user.schema'
import { AuthService } from '@users/auth/auth.service'
import { CurrentUser } from '@users/decorators/current-user.decorator'
import { LoginRequest } from '@users/dto/login.request'
import { LoginResponse } from '@users/dto/login.response'
import { LocalAuthGuard } from '@users/auth/auth-guards/local-auth.guard'
import JwtAuthGuard from './auth-guards/jwt-auth.guard'

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
    return this.authService.login(user)
  }

  @MessagePattern('validate_user')
  async validateUser(data) {
    console.log('validateUserByData:', data)
    try {
      const res = this.authService.validateToken(data.jwt)

      return res
    } catch (e) {
      return null
    }
  }
}

