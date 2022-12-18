import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

import { RmqService } from '@app/common'
import { ProjectData } from '@projects/dto/project.data'
import { JwtAuthGuard } from '@projects/guards/jwt-auth.guard'
import { CurrentUserId } from '@app/common/utils/'
import { ProjectsService } from '@projects/projects.service'
import { CreateProjectRequest } from '@projects/dto/create-project.request'

const apiTag = 'projects'

@Controller(apiTag)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly rmqService: RmqService,
  ) {}

  @Post()
  @ApiTags(apiTag)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: ProjectData })
  create(@Body() request: CreateProjectRequest, @CurrentUserId() userId: string) {
    return this.projectsService.createProject(request, userId)
  }

  @Get()
  @ApiTags(apiTag)
  @ApiOkResponse({ type: [ProjectData] })
  find() {
    return this.projectsService.getProjects()
  }

  @EventPattern('auditor_created')
  async handleAuditorCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.projectsService.greetService(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }

  @EventPattern('user_created')
  async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.projectsService.greetService(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }
}

