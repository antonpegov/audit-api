import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import { Controller, Post, Body, Get } from '@nestjs/common'
import { RmqService } from '@app/common'

import { Auditor } from '@auditors/schemas/auditor.schema'
import { CreateAuditor } from '@auditors/dto/create-auditor.dto'
import { AuditorsService } from '@auditors/auditors.service'

const apiTag = 'auditors'

@Controller(apiTag)
export class AuditorsController {
  constructor(
    private readonly auditorsService: AuditorsService,
    private readonly rmqService: RmqService,
  ) {}

  @Post()
  @ApiTags(apiTag)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Creates new auditor' })
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

  @EventPattern('project_created')
  async handleProjectCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.auditorsService.greetService(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }

  @EventPattern('user_created')
  async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.auditorsService.greetService(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }
}

