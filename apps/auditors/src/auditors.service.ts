import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'

import { Auditor } from '@auditors/schemas/auditor.schema'
import { CreateAuditorRequest } from '@auditors/dto/create-auditor.request'
import { AuditorsRepository } from '@auditors/auditors.repository'
import { PROJECTS_SERVICE, USERS_SERVICE } from '@auditors/constants/services'

@Injectable()
export class AuditorsService {
  private readonly logger = new Logger(AuditorsService.name)

  constructor(
    private readonly auditorsRepository: AuditorsRepository,
    @Inject(USERS_SERVICE) private usersClient: ClientProxy,
    @Inject(PROJECTS_SERVICE) private projectsClient: ClientProxy,
  ) {}

  async createAuditor(request: CreateAuditorRequest, ownerId: string): Promise<Auditor> {
    if (await this.auditorsRepository.findOneOrReturnNull({ ownerId })) {
      throw new BadRequestException('You already have an auditor account')
    }

    const session = await this.auditorsRepository.startTransaction()

    try {
      const auditor = await this.auditorsRepository.create(
        { ...request, registerDate: new Date(), ownerId },
        { session },
      )

      await lastValueFrom(
        this.projectsClient.emit('auditor_created', {
          request,
        }),
      )
      await lastValueFrom(
        this.usersClient.emit('auditor_created', {
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
    return this.auditorsRepository.find({})
  }

  greetService(data: any) {
    this.logger.log(data)
  }
}

