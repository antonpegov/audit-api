import { Controller, Post, Body } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import { AuditorsService } from '@auditors/auditors.service'
import { CreateAuditorRequest } from '@auditors/dto/create-auditor.dto'
import { Auditor } from './schemas/auditor.schema'

@Controller('auditors')
export class AuditorsController {
  constructor(private readonly auditorsService: AuditorsService) {}

  @Post()
  createAuditor(@Body() request: CreateAuditorRequest) {
    return this.auditorsService.createAuditor(request)
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Auditor,
  })
  async create(@Body() request: CreateAuditorRequest): Promise<Auditor> {
    return this.auditorsService.createAuditor(request)
  }
}

