import { Controller, Post, Body, Logger, Get } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import { Auditor } from '@auditors/schemas/auditor.schema'
import { AuditorsService } from '@auditors/auditors.service'
import { CreateAuditorRequest } from '@auditors/dto/create-auditor.dto'

@Controller('auditors')
export class AuditorsController {
  constructor(private readonly auditorsService: AuditorsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Auditor,
  })
  create(@Body() request: CreateAuditorRequest) {
    return this.auditorsService.createAuditor(request)
  }

  @Get()
  @ApiCreatedResponse({
    description: 'The records a successfully recieved.',
    type: Auditor,
  })
  find() {
    return this.auditorsService.getAuditors()
  }
}

