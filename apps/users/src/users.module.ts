import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import * as Joi from 'joi'

import { UsersService } from '@users/users.service'
import { EmailAvailable } from '@users/validators/email-available'
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
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_USERS_QUEUE: Joi.string().required(),
        RABBIT_MQ_AUDITORS_QUEUE: Joi.string().required(),
        RABBIT_MQ_PROJECTS_QUEUE: Joi.string().required(),
      }),
      envFilePath,
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
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, EmailAvailable],
  exports: [UsersService],
})
export class UsersModule {}
