import { Controller, Post, Body, Get } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import { Auditor } from '@auditors/schemas/auditor.schema'
import { CreateAuditor } from '@auditors/dto/create-auditor.dto'
import { AuditorsService } from '@auditors/auditors.service'

@Controller('auditors')
export class AuditorsController {
  constructor(private readonly auditorsService: AuditorsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Auditor,
  })
  create(@Body() request: CreateAuditor) {
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

