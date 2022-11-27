import { Injectable } from '@nestjs/common'

import { AuditorsRepository } from '@auditors/auditors.repository'
import { CreateAuditorRequest } from '@auditors/dto/create-auditor.dto'

@Injectable()
export class AuditorsService {
  constructor(private readonly auditorsRepository: AuditorsRepository) {}

  createAuditor(request: CreateAuditorRequest) {
    return this.auditorsRepository.create(request)
  }
}

