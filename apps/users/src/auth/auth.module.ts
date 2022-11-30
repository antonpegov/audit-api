import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { RmqModule } from '@app/common'
import { Module } from '@nestjs/common'
import * as Joi from 'joi'

import { JwtStrategy } from '@users/auth/auth-strategies/jwt.strategy'
import { AuthService } from '@users/auth/auth.service'
import { UsersService } from '@users/users.service'
import { LocalStrategy } from '@users/auth/auth-strategies/local.strategy'
import { AuthController } from '@users/auth/auth.controller'
import { UsersModule } from '@users/users.module'

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        JWT_EXP: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/auth/.env',
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXP')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}

