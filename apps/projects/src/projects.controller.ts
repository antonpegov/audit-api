import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'
import { RmqService } from '@app/common'
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Project } from '@projects/schemas/project.schema'
import { JwtAuthGuard } from '@projects/guards/jwt-auth.guard'
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
  @ApiCookieAuth()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: Project })
  create(@Body() request: CreateProjectRequest) {
    return this.projectsService.createProject(request)
  }

  @Get()
  @ApiTags(apiTag)
  @ApiOkResponse({
    description: 'The records a successfully recieved.',
    type: [Project],
  })
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

