import { Injectable, Logger } from '@nestjs/common'

import { AuditorsRepository } from '@auditors/auditors.repository'
import { CreateAuditorRequest } from '@auditors/dto/create-auditor.dto'
import { Auditor } from './schemas/auditor.schema'

@Injectable()
export class AuditorsService {
  constructor(private readonly auditorsRepository: AuditorsRepository) {}

  createAuditor(request: CreateAuditorRequest): Promise<Omit<Auditor, 'password'>> {
    return this.auditorsRepository.create(request).then((auditor) => {
      delete auditor.password

      return auditor
    })
  }

  getAuditors(): Promise<Auditor[]> {
    return this.auditorsRepository.find({}).then((auditors) => {
      auditors.forEach((auditor) => delete auditor.password)

      return auditors
    })
  }
}

