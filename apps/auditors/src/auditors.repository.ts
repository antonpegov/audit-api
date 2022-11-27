import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Injectable, Logger } from '@nestjs/common'
import { Connection, Model } from 'mongoose'

import { AbstractRepository } from '@app/common'

import { Auditor } from '@auditors/schemas/auditor.schema'

@Injectable()
export class AuditorsRepository extends AbstractRepository<Auditor> {
  protected readonly logger = new Logger(AuditorsRepository.name)

  constructor(
    @InjectModel(Auditor.name) model: Model<Auditor>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection)
  }
}
