import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { Response } from 'express'

import { User } from '@users/schemas/user.schema'
import JwtAuthGuard from '@users/auth/auth-guards/jwt-auth.guard'
import { AuthService } from '@users/auth/auth.service'
import { CurrentUser } from '@users/decorators/current-user.decorator'
import { LocalAuthGuard } from '@users/auth/auth-guards/local-auth.guard'
import { LoginRequest } from '@users/dto/login.request'

const apiTag = 'auth'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiTags(apiTag)
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({
    description: 'Login success.',
    type: User,
  })
  async login(
    @Body() req: LoginRequest,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response)
    response.send(user)
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUser() user: User) {
    return user
  }
}

