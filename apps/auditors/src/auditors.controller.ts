import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Post, Body, Get } from '@nestjs/common'

import { Auditor } from '@auditors/schemas/auditor.schema'
import { CreateAuditor } from '@auditors/dto/create-auditor.dto'
import { AuditorsService } from '@auditors/auditors.service'

const apiTag = 'auditors'

@Controller(apiTag)
export class AuditorsController {
  constructor(private readonly auditorsService: AuditorsService) {}

  @Post()
  @ApiTags(apiTag)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Auditor,
  })
  create(@Body() request: CreateAuditor) {
    return this.auditorsService.createAuditor(request)
  }

  @Get()
  @ApiTags(apiTag)
  @ApiOkResponse({
    description: 'The records a successfully recieved.',
    type: [Auditor],
  })
  find() {
    return this.auditorsService.getAuditors()
  }
}
