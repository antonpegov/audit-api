import { Inject, Injectable } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'

import { Auditor } from '@auditors/schemas/auditor.schema'
import { CreateAuditor } from '@auditors/dto/create-auditor.dto'
import { PROJECTS_SERVICE } from '@auditors/constants/services'
import { AuditorsRepository } from '@auditors/auditors.repository'

@Injectable()
export class AuditorsService {
  constructor(
    private readonly auditorsRepository: AuditorsRepository,
    @Inject(PROJECTS_SERVICE) private projectsClient: ClientProxy,
  ) {}

  async createAuditor(request: CreateAuditor): Promise<Omit<Auditor, 'password'>> {
    const session = await this.auditorsRepository.startTransaction()

    try {
      const auditor = await this.auditorsRepository.create(request, { session })

      await lastValueFrom(
        this.projectsClient.emit('auditor_created', {
          request,
        }),
      )
      await session.commitTransaction()
      return auditor
    } catch (err) {
      await session.abortTransaction()
      throw err
    }
  }

  getAuditors(): Promise<Auditor[]> {
    return this.auditorsRepository.find({}).then((auditors) => {
      auditors.forEach((auditor) => delete auditor.password)

      return auditors
    })
  }
}

