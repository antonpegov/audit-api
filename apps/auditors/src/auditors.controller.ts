import { Controller, Post, Body, Get, UseGuards, Req, Logger } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import { RmqService } from '@app/common'
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { Auditor } from '@auditors/schemas/auditor.schema'
import { JwtAuthGuard } from '@auditors/guards/jwt-auth.guard'
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: Auditor })
  create(@Body() request: CreateAuditor, @Req() req: any) {
    Logger.log('request: ' + JSON.stringify(request))

    return this.auditorsService.createAuditor(request)
  }

  @Get()
  @ApiTags(apiTag)
  @ApiOkResponse({ type: [Auditor] })
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

