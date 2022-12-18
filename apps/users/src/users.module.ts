import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import * as Joi from 'joi'

import { JwtStrategy } from '@users/guards/jwt.strategy'
import { AuthService } from '@users/auth.service'
import { UsersService } from '@users/users.service'
import { LocalStrategy } from '@users/guards/local.strategy'
import { EmailAvailable } from '@users/validators/email-available'
import { AuthController } from '@users/auth.controller'
import { UsersRepository } from '@users/users.repository'
import { UsersController } from '@users/users.controller'
import { AUDITORS_SERVICE } from '@users/constants/services'
import { PROJECTS_SERVICE } from '@users/constants/services'
import { User, UserSchema } from '@users/schemas/user.schema'
import { DatabaseModule, RmqModule } from '@app/common'

const envFilePath =
  process.env.NODE_ENV === 'production' ? '.env.users' : './apps/users/.env'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        JWT_EXP: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_USERS_QUEUE: Joi.string().required(),
        RABBIT_MQ_AUDITORS_QUEUE: Joi.string().required(),
        RABBIT_MQ_PROJECTS_QUEUE: Joi.string().required(),
      }),
      envFilePath,
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
    RmqModule.register({
      name: PROJECTS_SERVICE,
    }),
    RmqModule.register({
      name: AUDITORS_SERVICE,
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    AuthService,
    UsersService,
    UsersRepository,
    EmailAvailable,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class UsersModule {}

