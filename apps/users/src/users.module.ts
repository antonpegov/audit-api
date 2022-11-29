import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import * as Joi from 'joi'

import { UsersService } from '@users/users.service'
import { UsersRepository } from '@users/users.repository'
import { UsersController } from '@users/users.controller'
import { AUDITORS_SERVICE } from '@users/constants/services'
import { PROJECTS_SERVICE } from '@users/constants/services'
import { User, UserSchema } from '@users/schemas/user.schema'
import { DatabaseModule, RmqModule } from '@app/common'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_USERS_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/users/.env',
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
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}

