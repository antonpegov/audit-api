import { Controller, Post, Body, Get, UseGuards, Req, Logger } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Auditor } from '@auditors/schemas/auditor.schema'
import { RmqService } from '@app/common'
import { AuditorData } from '@auditors/dto/auditor.data'
import { JwtAuthGuard } from '@auditors/guards/jwt-auth.guard'
import { CurrentUserId } from '@app/common/utils/'
import { CreateAuditorRequest } from '@auditors/dto/create-auditor.request'
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: AuditorData })
  create(@Body() request: CreateAuditorRequest, @CurrentUserId() userId: string) {
    return this.auditorsService.createAuditor(request, userId)
  }

  @Get()
  @ApiTags(apiTag)
  @ApiOkResponse({ type: [AuditorData] })
  find() {
    return this.auditorsService.getAuditors()
  }

  @EventPattern('project_created')
  async handleProjectCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.auditorsService.greetService(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }

  @EventPattern('customer_created')
  handleustomerCreated(@Payload() data: any, @Ctx() context: RmqContext) {
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

