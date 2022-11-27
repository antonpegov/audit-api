import { Injectable } from '@nestjs/common'

import { Auditor } from '@auditors/schemas/auditor.schema'
import { CreateAuditor } from '@auditors/dto/create-auditor.dto'
import { AuditorsRepository } from '@auditors/auditors.repository'

@Injectable()
export class AuditorsService {
  constructor(private readonly auditorsRepository: AuditorsRepository) {}

  createAuditor(request: CreateAuditor): Promise<Omit<Auditor, 'password'>> {
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

