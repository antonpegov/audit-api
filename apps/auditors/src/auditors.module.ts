import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import * as Joi from 'joi'

import { DatabaseModule } from '@app/common'
import { AuditorsService } from './auditors.service'
import { AuditorsController } from './auditors.controller'
import { AuditorsRepository } from './auditors.repository'
import { Auditor, AuditorSchema } from './schemas/auditor.schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: './apps/auditors/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Auditor.name, schema: AuditorSchema }]),
  ],
  controllers: [AuditorsController],
  providers: [AuditorsService, AuditorsRepository],
})
export class AuditorsModule {}

