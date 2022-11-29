import { Inject, Injectable, Logger } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'

import { Auditor } from '@auditors/schemas/auditor.schema'
import { CreateAuditor } from '@auditors/dto/create-auditor.dto'
import { PROJECTS_SERVICE } from '@auditors/constants/services'
import { AuditorsRepository } from '@auditors/auditors.repository'

@Injectable()
export class AuditorsService {
  private readonly logger = new Logger(AuditorsService.name)

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
      this.logger.log(`'auditor_created' emitted`)
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

  greetService(data: any) {
    console.log(data)
    this.logger.log(data)
  }
}

