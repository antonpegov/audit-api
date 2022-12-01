import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import * as Joi from 'joi'

import { AuditorsService } from '@auditors/auditors.service'
import { AuditorsController } from '@auditors/auditors.controller'
import { AuditorsRepository } from '@auditors/auditors.repository'
import { Auditor, AuditorSchema } from '@auditors/schemas/auditor.schema'
import { DatabaseModule, RmqModule } from '@app/common'
import {
  AUTH_SERVICE,
  PROJECTS_SERVICE,
  USERS_SERVICE,
} from '@auditors/constants/services'

@Module({
  imports: [
    DatabaseModule,
    RmqModule.register({
      name: PROJECTS_SERVICE,
    }),
    RmqModule.register({
      name: USERS_SERVICE,
    }),
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
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
      envFilePath: './apps/auditors/.env',
    }),
    MongooseModule.forFeature([{ name: Auditor.name, schema: AuditorSchema }]),
  ],
  controllers: [AuditorsController],
  providers: [AuditorsService, AuditorsRepository],
})
export class AuditorsModule {}

